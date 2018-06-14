/**
 * Created by yangxuanbin on 2018/6/11
 **/

import { Linking, Platform } from 'react-native';

export const goMap=(lon = 0, lat = 0, targetAppName = 'baidu', name = '目标地址')=>{
  if (lat == 0 && lon == 0)
    return console.warn('暂时不能导航');


  let webUrl = `http://uri.amap.com/navigation?to=${lon},${lat},${name}&mode=bus&coordinate=gaode`;
  let webUrlGaode = `http://uri.amap.com/navigation?to=${lon},${lat},${name}&mode=bus&coordinate=gaode`;
  let webUrlBaidu = `http://api.map.baidu.com/direction?destination=latlng:${lat},${lon}|name=${name}&mode=transit&coord_type=gcj02&output=html&src=mybaoxiu|wxy`;

  let url = webUrl;
  if (Platform.OS === 'android') {
    if (targetAppName === 'gaode') {
      // webUrl = 'androidamap://navi?sourceApplication=appname&poiname=fangheng&lat=36.547901&lon=104.258354&dev=1&style=2';
      url = `androidamap://route?sourceApplication=appname&dev=0&m=0&t=1&dlon=${lon}&dlat=${lat}&dname=${name}`;
      webUrl = webUrlGaode;
    } else if (targetAppName === 'baidu') {
      url = `baidumap://map/direction?destination=name:${name}|latlng:${lat},${lon}&mode=transit&coord_type=gcj02&src=thirdapp.navi.mybaoxiu.wxy#Intent;scheme=bdapp;package=com.baidu.BaiduMap;end`;
      webUrl = webUrlBaidu;
    }
  } else if (Platform.OS === 'ios') {
    if (targetAppName === 'gaode') {
      url = `iosamap://path?sourceApplication=appname&dev=0&m=0&t=1&dlon=${lon}&dlat=${lat}&dname=${name}`;
      webUrl = webUrlGaode;
    } else if (targetAppName === 'baidu') {
      url = `baidumap://map/direction?destination=name:${name}|latlng:${lat},${lon}&mode=transit&coord_type=gcj02&src=thirdapp.navi.mybaoxiu.wxy#Intent;scheme=bdapp;package=com.baidu.BaiduMap;end`;
      webUrl = webUrlBaidu;
    }
  }

  Linking.canOpenURL(url).then(supported => {
    if (!supported) {
      console.log(`Can't handle url:${url}`);
      return Linking.openURL(webUrl).catch(e => console.warn(e));
    } else {
      return Linking.openURL(url).catch(e => console.warn(e));
    }
  }).catch(err => console.error('An error occurred', err));

};

