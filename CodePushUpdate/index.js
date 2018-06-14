/**
 * Created by yangxuanbin on 07/12/2017
 **/
import codePush from 'react-native-code-push'
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';

const popUpImg = require('./popUp.png');
export default class CodePushUpdate extends Component {
  constructor(props){
    super(props);
    this.state={
      status:'',
      total:0,
      totalBytes:0,
      receivedBytes:0,
      modeStatus:false,
      startUpload:false,
      description:'',
    }
  }

  checkedUp=false;

  componentDidMount() {
     codePush.checkForUpdate()
       .then((update) => {
         if (update){
           this.setState({description:update.description, modeStatus:true});
         }
       });
  }



  update(){
    if(this.checkedUp)
      return false;
    this.checkedUp=true;
    this.setState({startUpload:true});
    codePush.sync({
        installMode: codePush.InstallMode.IMMEDIATE,//启动模式三种：ON_NEXT_RESUME、ON_NEXT_RESTART、IMMEDIATE
      },
      (status) => {this.setState({status})},
      ({receivedBytes, totalBytes}) => {
        this.setState({receivedBytes, totalBytes,total:Math.floor(receivedBytes/totalBytes*100)})
      }
    );
  }


  _renderContent(){
    const {startUpload,description,total} = this.state;
    if(startUpload){
      return (
        <View style={[styles.content,styles.center]}>
          <Text style={styles.progressText}>更新进度{total}%</Text>
          <View style={styles.progress}>
            <View style={[styles.nowProgress,{width:total+'%'}]}></View>
          </View>
        </View>
      )
    }
    return(
      <View style={styles.content}>
        <Text numberOfLines={3} style={styles.updateDesc}>{description}</Text>
      </View>
    )
  }

  render() {
    const {receivedBytes,totalBytes,status,modeStatus,description} = this.state;
    if(!modeStatus) return null;
    return (
      <View style={styles.codePushFlex}>
        <View style={styles.codePushWrap}>
          <Image style={styles.popUp} source={popUpImg} />
          <View style={styles.popView}>
            {this._renderContent()}
            <TouchableOpacity activeOpacity={0.8} onPress={::this.update} style={styles.updateAppBtn}>
              <Text style={{color:'#fff',fontSize:scaleSize(34)}}>确认更新</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  codePushWrap:{
    width:scaleSize(600),
    paddingTop:scaleSize(60),
    borderRadius:scaleSize(3)
  },
  codePushFlex:{
    top:0,
    left:0,
    position:'absolute',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'rgba(0,0,0,0.5)',
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height
  },
  popUp:{
    marginTop:-scaleSize(58),
    width:scaleSize(600),
    height:scaleSize(258)
  },
  popView:{
    width:scaleSize(600),
    height:scaleSize(310),
    backgroundColor:'#fff',
  },
  updateAppBtn:{
    backgroundColor:'#ff9c00',
    marginLeft:scaleSize(30),
    width:scaleSize(540),
    height:scaleSize(80),
    borderRadius:scaleSize(4),
    justifyContent:'center',
    alignItems:'center'
  },
  content:{
    height:scaleSize(200),
    padding:scaleSize(30)
  },
  center:{
    justifyContent:'center',
    alignItems:'center'
  },
  updateDesc:{
    color:'#666',
    fontSize:scaleSize(28),
    lineHeight:scaleSize(39)
  },
  progressText:{
    fontSize:scaleSize(28),
    paddingTop:scaleSize(25),
    color:'#999'
  },
  progress:{
    borderWidth:1,
    width:scaleSize(470),
    height:scaleSize(30),
    borderColor:'#617DBF',
  },
  nowProgress:{
    height:scaleSize(30),
    backgroundColor:'#617DBF'
  }
});


