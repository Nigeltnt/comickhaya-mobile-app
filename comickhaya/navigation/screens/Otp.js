import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableHighlight,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apilink from '../config/Globals';

export default function Otp({ navigation }) {

  const [pin, setPin] = useState('');

  const [showAlert, setShowAlert] = React.useState(false);
  const [alerttext, setAlerttext] = React.useState('');
  const [alerttitle, setAlerttitle] = React.useState('');

  const [indicate, setIndicate] = useState(false);

  const doAlert = (txt, ttl) => {
    setShowAlert(!showAlert);
    setAlerttext(txt);
    setAlerttitle(ttl);
  };

  const otpSending = async () => {
    if (pin == '') {
      doAlert('Provide OTP', 'Submission Error');
      return;
    }

    let value = await AsyncStorage.getItem('MemberMail');
    value = value.replace(/\s/g, '');

    setIndicate(true);
    const apiLink = Apilink.getLink();
    let settingsresp = await fetch(`${apiLink}otp.php`, {
      method: 'post',
      body: JSON.stringify({
        member: value,
        otp: pin,
      }),
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    let resJson = await settingsresp.json();

    console.log(resJson);
    setIndicate(false);
    if (resJson.message === 'Account not yet activated. Provide OTP') {
      doAlert('Account not yet activated. Re-enter OTP!', 'Auth Info');
      return;
    }
    if (resJson.message === 'Auth failed. Wrong OTP') {
      doAlert('Auth failed. Wrong OTP!', 'Auth Info');
      return;
    }
    if (resJson.message === 'Unable to authorise account. Data is incomplete') {
      doAlert(resJson.message, 'Auth Info');
      return;
    }

    if (resJson.length > 0) {
      if (resJson[0].status == 'Active') {
        //Open session
        AsyncStorage.multiSet([
          ['UserID', resJson[0].userid.toString()],
          ['UserName', resJson[0].alias],
          ['UserGender', resJson[0].gender],
          ['UserMail', resJson[0].email]
        ]);
        
        //Navigate to home screen
        navigation.navigate('DashTabScreens');
      }
    }
  };

  const HeaderIn = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headContainer}>
          <Text style={{ fontSize: 26, fontWeight: 'bold' }}>Otp</Text>
          <Image
            style={styles.topIcon}
            source={require('../../assets/lggg.jpeg')}
            resizeMode="contain"
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alerttitle}
        message={alerttext}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Ok"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          doAlert('', '');
        }}
        onConfirmPressed={() => {
          doAlert('', '');
        }}
      />

          <HeaderIn />
          <View style={styles.authContainer}>
            <View style={styles.textContainer}>
              <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 17, fontWeight: 'bold', color: 'black' }}>
                ComicKhaya account OTP sign in
              </Text>
            </View>
         
            <View style={styles.inputContainer}>
              <Ionicons
                style={{ marginLeft: 4 }}
                name="log-in-outline"
                size={38}
                color="black"
              />
              <TextInput
                style={styles.inputs}
                placeholder="OTP"
                secureTextEntry={true}
                placeholderTextColor="#888888"
                underlineColorAndroid="transparent"
                value={pin}
                onChangeText={(text) => setPin(text)}
              />
            </View>
            <View style={styles.btnContainer}>
              <TouchableHighlight
                style={styles.signinButton}
                onPress={() => otpSending()}>
                <Text style={styles.loginText}>Sign In</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.textContainer}>
              <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 12, fontWeight: 'bold', color: 'tomato' }}>
                Fill in the OTP sent to you via email to proceed
              </Text>
            </View>
            
          </View>
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 23,
  },
  header: {
    width: '100%',
    height: '10%',
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '12%',
    paddingRight: '12%',
  },
  headContainer: {
    backgroundColor: 'tomato',
    width: '97%',
    height: 50,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  authContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    borderBottomColor: 'tomato',
    backgroundColor: 'tomato',
    borderRadius: 10,
    borderBottomWidth: 1,
    width: '75%',
    height: 50,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    width: '75%',
    height: 50,
    marginTop: 10,
    alignItems: 'center',
  },
  btnContainer: {
    borderRadius: 10,
    width: '75%',
    height: 70,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  signinButton: {
    backgroundColor: 'tomato',
    width: '100%',
    height: 50,
    padding: 10,
    borderRadius: 7,
    marginRight: 1,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Cochin',
    color: 'white',
    fontWeight: 'bold',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    paddingLeft: 10,
    marginRight: 10,
    borderBottomColor: '#FFFFFF',
    borderRadius: 10,
    backgroundColor: '#FFFFED',
    flex: 1,
    fontColor: '#023020',
    fontSize: 18,
    fontWeight: 'bold',
  },
  topIcon: {
    width: 100,
    height: '100%',
    marginBottom: 5,
    marginTop: 5,
    borderRadius: 5,
  },
});
