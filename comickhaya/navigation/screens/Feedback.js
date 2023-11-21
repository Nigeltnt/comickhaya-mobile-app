import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import Apilink from '../config/Globals';
//import { useNavigation } from '@react-navigation/native';

export default function Feedback({ navigation }) {
  const [showAlert, setShowAlert] = React.useState(false);
  const [alerttext, setAlerttext] = React.useState('');
  const [alerttitle, setAlerttitle] = React.useState('');
  const [help, setHelp] = React.useState('');
  const [indicate, setIndicate] = useState(false);

  const [userid, setUserid] = useState('');
  const [mail, setMail] = useState('');
  const [user, setUser] = useState('');

  const doAlert = (txt, ttl) => {
    setShowAlert(!showAlert);
    setAlerttext(txt);
    setAlerttitle(ttl);
  };

  const Header = () => {
    return (
      <View style={styles.header}>
        <Ionicons name="chatbubble-ellipses-outline" size={25} color="black" />

        <Text style={styles.iconText}>Help / Feedback</Text>
        <Image
          style={styles.topIcon}
          source={require('../../assets/lggg.jpeg')}
        />
      </View>
    );
  };

  const sendFeedback = async () => {
    var apiLink = Apilink.getLink();
    Alert.alert(help);
    if (help !== '') {
      setIndicate(true);
      let res = await fetch(`${apiLink}feedback.php`, {
        method: 'post',
        body: JSON.stringify({
          alias: user,
          userid: userid,
          email: mail,
          feedback: help,
        }),
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      let resJson = await res.json();
      setIndicate(false);
      if (resJson.message === 'Feedback submission successfull') {
        setHelp('');
        //navigation.navigate('Purchased');
        doAlert(resJson.message, 'Success Info');
      } else {
        doAlert(resJson.message, 'Error Info');
        return;
      }
    } else {
      doAlert(
        'Error. Fill in the review details before submission!',
        'Error Info'
      );
    }
  };

    useEffect(() => {
    const getBook = async () => {
      try {
       
        let authId = await AsyncStorage.getItem('UserID');
        let authMail = await AsyncStorage.getItem('UserMail');
        let authAlias = await AsyncStorage.getItem('UserName');
       
        setUserid(authId);
        setMail(authMail);
        setUser(authAlias);

      } catch (error) {
        console.log(error);
      }
    };

    getBook();
  }, []);

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

      <Header />
      <View style={styles.outerView}>
        <View style={styles.innerView}>
          <Text style={styles.headerText}>ComicKhaya App Help & Feedback</Text>
          <Text style={styles.revText}>
            We hope you are enjoying our services! We would love to hear about
            your experience on how to improve our services for you. So please
            leave us your ideas, help or any reviews here.{' '}
          </Text>
          <TextInput
            editable
            multiline
            numberOfLines={8}
            maxLength={40}
            onChangeText={(text) => setHelp(text)}
            value={help}
            style={{
              padding: 10,
              borderWidth: 1,
              borderColor: 'tomato',
              marginTop: 10,
              width: '100%',
              borderRadius: 6,
            }}
          />
          <TouchableHighlight
            style={styles.buyPressable}
            onPress={() => {
              sendFeedback();
            }}>
            <Text style={styles.buyBtnText}>
              {' '}
              {indicate && <ActivityIndicator color={'#fff'} />}
              {indicate == false && 'Send Feedback'}
            </Text>
          </TouchableHighlight>
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
  outerView: {
    width: '100%',
    height: '92%',
    alignItems: 'center',
    marginTop: 100,
  },
  innerView: {
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: 10,
    marginTop: 20,
  },
  iconText: {
    fontColor: '#023020',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  headerText: {
    fontColor: '#023020',
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: 'tomato',
  },
  revText: {
    color: '#023020',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
  },
  buyPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'gray',
    backgroundColor: 'tomato',
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 7,
    height: 37,
    width: '100%',
  },
  buyBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginTop: 3,
  },
});
