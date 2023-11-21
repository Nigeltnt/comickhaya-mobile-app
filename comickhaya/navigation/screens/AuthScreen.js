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

export default function AuthScreen({ navigation }) {
  const [btntxt, setBtntxt] = useState('Proceed');
  const [emaill, setEmaill] = useState('kmubatapasango@rocketmail.com');
  const [pinn, setPinn] = useState('1234');

  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [cnpin, setCnpin] = useState('');
  const [page, setPage] = useState('SignIn');

  const [selected, setSelected] = React.useState('gender');
  const [showopt, setShowopt] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alerttext, setAlerttext] = React.useState('');
  const [alerttitle, setAlerttitle] = React.useState('');

  const [indicate, setIndicate] = useState(false);

  const doAlert = (txt, ttl) => {
    setShowAlert(!showAlert);
    setAlerttext(txt);
    setAlerttitle(ttl);
  };

  const doSearch = () => {
    console.log(34);
  };

  const sendForm = async () => {
    if (
      alias == '' ||
      email == '' ||
      phone == '' ||
      selected == '' ||
      pin == '' ||
      cnpin == ''
    ) {
      doAlert('Fill all the missing form details!', 'Submission Error');
      return;
    }

    if (pin !== cnpin) {
      doAlert('Pin is not correctly confirmed!', 'Submission Error');
      return;
    }
    setIndicate(true);
    const apiLink = Apilink.getLink();
    let settingsresp = await fetch(`${apiLink}signup.php`, {
      method: 'post',
      body: JSON.stringify({
        alias: alias,
        gender: selected,
        email: email,
        phone: phone,
        pin: pin,
      }),
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    let resJson = await settingsresp.json();

    console.log(resJson);
    setIndicate(false);
    if (resJson.message === 'Account creation successfull') {
      doAlert('Account suucesslly created!', 'Success Info');
      move(email);
      return;
    } else {
      doAlert(resJson.message, 'Error Info');
      return;
    }
  };

  const move = async (mem) => {
    try {
      await AsyncStorage.setItem('MemberMail', mem);
      navigation.navigate('Otp');
    } catch (e) {
      console.log(e);
    }
  };

  const doAuth = async () => {
    if (emaill == '' || pinn == '') {
      doAlert('Fill in all the required details!', 'Submission Error');
      return;
    }

    setIndicate(true);
    const apiLink = Apilink.getLink();
    let authresp = await fetch(`${apiLink}auth.php`, {
      method: 'post',
      body: JSON.stringify({
        email: emaill,
        password: pinn,
      }),
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    let resJson = await authresp.json();

    console.log(resJson);
    setIndicate(false);
    if (resJson.message === 'Account not yet activated. Provide OTP') {
      doAlert('Account not yet activated. Provide OTP!', 'Auth Info');
      return;
    }
    if (resJson.message === 'Auth failed. Try again') {
      doAlert('Login failed. Try again!', 'Auth Info');
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
          ['UserMail', resJson[0].email],
          ['UserPhone', resJson[0].phone],
        ]);
        
        //Navigate to home screen
        navigation.navigate('DashTabScreens');
      }
    }
  };

  const HeaderIn = () => {
    return (
      <View style={styles.header}>
        <Ionicons name="log-in-outline" size={30} color="black" />

        <Image
          style={styles.topIcon}
          source={require('../../assets/lggg.jpeg')}
        />
      </View>
    );
  };
  const HeaderUp = () => {
    return (
      <View style={styles.header}>
        <Ionicons name="log-in-outline" size={30} color="black" />

        <Image
          style={styles.topIcon}
          source={require('../../assets/lggg.jpeg')}
        />
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

      {page == 'SignIn' ? (
        <>
          <HeaderIn />
          <View style={styles.authContainer}>
            <View style={styles.textContainer}>
              <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 17, fontWeight: 'bold', color: 'black' }}>
                ComicKhaya account sign in
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons
                style={{ marginLeft: 10 }}
                name="mail-outline"
                size={30}
                color="black"
              />
              <TextInput
                style={styles.inputs}
                placeholder="email"
                placeholderTextColor="#888888"
                underlineColorAndroid="transparent"
                value={emaill}
                onChangeText={(text) => setEmaill(text)}
              />
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
                placeholder="password"
                secureTextEntry={true}
                placeholderTextColor="#888888"
                underlineColorAndroid="transparent"
                value={pinn}
                onChangeText={(text) => setPinn(text)}
              />
            </View>
            <View style={styles.btnContainer}>
              <TouchableHighlight
                style={styles.signinButton}
                onPress={() => doAuth()}>
                <Text style={styles.loginText}>
                  {indicate && <ActivityIndicator color={'#fff'} />}
                  {indicate == false && 'Sign In'}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={styles.textContainer}>
              <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 12, fontWeight: 'bold', color: 'tomato' }}>
                By signing in, you agree to the ComicKhaya Book Store Terms of
                Use and its Privacy Notice
              </Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableHighlight
                style={styles.signupButton}
                onPress={() => setPage('SignUp')}>
                <Text style={styles.loginText}>
                  Create a new ComicKhaya account
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </>
      ) : (
        <>
          <HeaderUp />
          <View style={styles.authContainer}>
            <View style={styles.textContainer}>
              <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 17, fontWeight: 'bold', color: 'black' }}>
                ComicKahaya account sign up
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons
                style={{ marginLeft: 10 }}
                name="person-outline"
                size={30}
                color="black"
              />
              <TextInput
                style={styles.inputs}
                placeholder="name"
                placeholderTextColor="#888888"
                underlineColorAndroid="transparent"
                value={alias}
                onChangeText={(text) => {
                  setAlias(text), setShowopt(false);
                }}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons
                style={{ marginLeft: 10 }}
                name="transgender-outline"
                size={30}
                color="black"
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  flexDirection: 'column',
                }}>
                {showopt ? (
                  <View
                    style={{
                      height: 120,
                      marginLeft: 16,
                      paddingLeft: 30,
                      paddingRight: 30,
                      marginRight: 10,
                      marginTop: 2,
                      marginBottom: 2,
                      borderBottomColor: '#FFFFFF',
                      borderRadius: 10,
                      backgroundColor: '#FFFFED',
                      flex: 1,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <View style={{ marginTop: 10 }}>
                      <Text
                        onPress={() => {
                          setSelected('Male'), setShowopt(false);
                        }}
                        style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          color: 'black',
                          backgroundColor: '#FFFFED',
                        }}>
                        Male
                      </Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                      <Text
                        onPress={() => {
                          setSelected('Female'), setShowopt(false);
                        }}
                        style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          color: 'black',
                          backgroundColor: '#FFFFED',
                        }}>
                        Female
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      height: 45,
                      marginLeft: 16,
                      paddingLeft: 10,
                      marginRight: 10,
                      marginTop: 2,
                      marginBottom: 2,
                      borderBottomColor: '#FFFFFF',
                      borderRadius: 10,
                      backgroundColor: '#FFFFED',
                      flex: 1,
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={
                        selected == 'Gender'
                          ? {
                              fontSize: 17,
                              fontWeight: 'bold',
                              color: 'gray',
                              marginTop: 5,
                            }
                          : {
                              fontSize: 17,
                              fontWeight: 'bold',
                              color: 'black',
                              marginTop: 5,
                            }
                      }>
                      {selected}
                    </Text>
                    <Ionicons
                      name="chevron-down-outline"
                      size={30}
                      color="black"
                      onPress={() => setShowopt(true)}
                    />
                  </View>
                )}
              </View>
            </View>
            <View style={styles.emailContainer}>
              <Ionicons
                style={{ marginLeft: 10 }}
                name="mail-outline"
                size={30}
                color="black"
              />
              <TextInput
                style={styles.inputs}
                placeholder="email"
                placeholderTextColor="#888888"
                underlineColorAndroid="transparent"
                value={email}
                onChangeText={(text) => {
                  setEmail(text), setShowopt(false);
                }}
              />
            </View>
            <View style={styles.emailContainer}>
              <Ionicons
                style={{ marginLeft: 10 }}
                name="phone-portrait-outline"
                size={30}
                color="black"
              />
              <TextInput
                style={styles.inputs}
                placeholder="mobile"
                placeholderTextColor="#888888"
                underlineColorAndroid="transparent"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text), setShowopt(false);
                }}
              />
            </View>
            <View style={styles.passContainer}>
              <Ionicons
                style={{ marginLeft: 10 }}
                name="ellipsis-horizontal-outline"
                size={30}
                color="black"
              />
              <TextInput
                style={styles.inputs}
                placeholder="password"
                secureTextEntry={true}
                placeholderTextColor="#888888"
                underlineColorAndroid="transparent"
                value={pin}
                onChangeText={(text) => {
                  setPin(text), setShowopt(false);
                }}
              />
            </View>
            <View style={styles.conContainer}>
              <Ionicons
                style={{ marginLeft: 10 }}
                name="ellipsis-horizontal-outline"
                size={30}
                color="black"
              />
              <TextInput
                style={styles.inputs}
                placeholder="confirm password"
                secureTextEntry={true}
                placeholderTextColor="#888888"
                underlineColorAndroid="transparent"
                value={cnpin}
                onChangeText={(text) => {
                  setCnpin(text), setShowopt(false);
                }}
              />
            </View>

            <View style={styles.btnContainer}>
              <TouchableHighlight
                style={styles.signinButton}
                onPress={() => sendForm()}>
                <Text style={styles.loginText}>
                  {indicate && <ActivityIndicator color={'#fff'} />}
                  {indicate == false && 'Sign Up'}
                </Text>
              </TouchableHighlight>
            </View>
            <View style={styles.textContainer}>
              <Text
                onPress={() => navigation.navigate('Home')}
                style={{ fontSize: 12, fontWeight: 'bold', color: 'tomato' }}>
                By signing up, you agree to the ComicKhaya Book Store Terms of
                Use and its Privacy Notice
              </Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableHighlight
                style={styles.signupButton}
                onPress={() => setPage('SignIn')}>
                <Text style={styles.loginText}>
                  Login to ComicKhaya account
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 23,
  },
 header: {
    marginTop: 5,
    width: '100%',
    height: '8%',
    backgroundColor: 'tomato',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  topIcon: {
    width: '20%',
    height: '100%',
    marginBottom: 5,
    marginTop: 5,
    borderRadius: 10,
  },
  authContainer: {
    width: '100%',
    height: '92%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    borderBottomColor: 'tomato',
    backgroundColor: 'tomato',
    borderRadius: 10,
    borderBottomWidth: 1,
    width: '90%',
    height: 50,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passContainer: {
    borderBottomColor: 'tomato',
    backgroundColor: 'tomato',
    borderRadius: 11,
    borderBottomWidth: 1,
    width: '90%',
    height: 50,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  conContainer: {
    borderBottomColor: 'tomato',
    backgroundColor: 'tomato',
    borderRadius: 11,
    borderBottomWidth: 1,
    width: '90%',
    height: 50,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emailContainer: {
    borderBottomColor: 'tomato',
    backgroundColor: 'tomato',
    borderRadius: 11,
    borderBottomWidth: 1,
    width: '90%',
    height: 50,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    width: '90%',
    height: 50,
    marginTop: 10,
    alignItems: 'center',
  },
  btnContainer: {
    borderRadius: 10,
    width: '90%',
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
  signupButton: {
    backgroundColor: '#36454F',
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
  }
});
