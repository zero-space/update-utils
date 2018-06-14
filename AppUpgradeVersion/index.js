/**
 * Created by yangxuanbin on 29/12/2017
 **/
import React,{Component} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  NativeModules,
  DeviceEventEmitter,
  Platform
} from 'react-native';

import DeviceInfo from 'react-native-device-info'
const appUpdateImg = require("./appUpdate.png");
const defalut = `\n优化系统性能\n针对用户使用习惯做出一些调整`

export default class AppUpgradeVersion extends Component{
  constructor(props){
    super(props);
    this.state = {
      modalVisible:false,
      showLoading:false,
      progress:0,
      apkUrl:this.props.versionData.downloadUrl,
      lineWidth:1,
      versionData:this.props.versionData || {}
    };
  }

  componentDidMount() {
      let version = this.props.versionData.versionCode;
      if(version){
        let noVersion =version.replace(/<|\.|>/g,""); ;
        let oldVersion =DeviceInfo.getVersion().replace(/<|\.|>/g,"");
        console.log(noVersion , oldVersion);
        noVersion > oldVersion? this.setState({modalVisible:true}):this.setState({modalVisible:false})
      }

    //监听百分比进度
    this.load_progress = DeviceEventEmitter.addListener('LOAD_PROGRESS',(msg)=>{
      this.setState({progress:msg})
    });
  }

  componentWillUnmount() {
    this.load_progress.remove();
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  updateApp(){
    const {appId} = this.props;
    this.setState({showLoading:true});
    Platform.OS=="ios"?
      NativeModules.upgrade.openAPPStore(appId)
    :
      NativeModules.upgrade.upgrade(this.state.apkUrl)
  }

  androidUpdate(){
    NativeModules.upgrade.upgrade(this.state.apkUrl)
  }

  render(){
    const {versionData} = this.props;
    return(
      <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.modalVisible}
      >
        <View style={styles.UpgradeVersion}>
          <ImageBackground source={appUpdateImg} style={styles.UpgradePic} >
            <View style={styles.updateInfo}>
              <Text style={styles.updateTipText}>【 {versionData.versionName||'2.0.1'} 】</Text>
            </View>
            <View style={styles.updateMessagesWrap}>
              <View><Text>本次更新内容:</Text></View>
              <View style={styles.updateMessagesLine} >
                <Text numberOfLines={3} style={styles.updateMessages}>
                  {versionData.content||defalut}
                </Text>
              </View>
            </View>
            <View style={{alignItems:'center'}}>
              {
                this.state.showLoading == false ?
                  <TouchableOpacity activeOpacity={0.7} style={styles.updateAppBtn} onPress={()=>{this.updateApp()}}>
                    <Text style={{color:'#fff'}}>立即升级</Text>
                  </TouchableOpacity>
                :
                <View style={styles.downloadStyle} >
                  <View style={styles.downloadLongWrap}>
                    <View style={[styles.downloadLong,{width:this.state.progress+'%'}]}></View>
                  </View>
                </View>
              }
            </View>
          </ImageBackground>
        </View>
      </Modal>
    )
  }
}

const styles=StyleSheet.create({
  UpgradeVersion:{
    flex:1,
    top:0,
    left:0,
    backgroundColor:'rgba(0,0,0,0.4)',
    position:'absolute',
    width:deviceWidth,
    height:deviceHeight,
    zIndex:9999,
    justifyContent:'center',
    alignItems:'center'
  },
  appCodePop:{
    left:'50%',
    top:'50%',
    marginLeft:-scaleSize(560/2),
    marginTop:-scaleSize(260/2+180),
    width:scaleSize(560),
    height:scaleSize(560),
    backgroundColor:'#ebebeb',
    borderRadius:4,
  },
  UpgradePic:{
    width:scaleSize(509),
    height:scaleSize(912),
  },
  updateInfo:{
    paddingTop:scaleSize(530),
    paddingHorizontal:scaleSize(20),
    alignItems:'flex-end'
  },
  updateTipText:{
    fontSize:15,
    color:'#53a7fd',
    paddingVertical:scaleSize(4)
  },
  updateAppBtn:{
    marginTop:scaleSize(36),
    width:scaleSize(200),
    height:scaleSize(70),
    backgroundColor:'#53a7fd',
    justifyContent:'center',
    alignItems:'center'
  },
  downloadStyle:{
    marginTop:scaleSize(30),
    height:scaleSize(70),
    justifyContent:'center',
    alignItems:'center'
  },
  downloadLongWrap:{
    marginTop:scaleSize(20),
    width:scaleSize(300),
    height:scaleSize(20),
    justifyContent:'center',
    alignItems:'flex-start',
    backgroundColor:'#ebebeb'
  },
  downloadLong:{
    height:scaleSize(20),
    backgroundColor:'#53a7fd'
  },
  updateMessagesWrap:{
    paddingTop:scaleSize(40),
    marginHorizontal:scaleSize(40),
    overflow:'hidden',
    height:scaleSize(200)
  },
  updateMessagesLine:{
    paddingLeft:scaleSize(20),
  },
  updateMessages:{
    lineHeight:scaleSize(30),
    color:'#666',
  }
});