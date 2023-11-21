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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AwesomeAlert from 'react-native-awesome-alerts';
//import { useNavigation } from '@react-navigation/native';

export default function Terms({ navigation }) {
  const [showAlert, setShowAlert] = React.useState(false);
  const [alerttext, setAlerttext] = React.useState('');
  //const navigation = useNavigation();

  const doAlert = (txt) => {
    setShowAlert(!showAlert);
    setAlerttext(txt);
  };

  const Header = () => {
    return (
      <View style={styles.header}>
        <Ionicons name="information-circle-outline" size={25} color="black" />

            <Text style={styles.iconText}>Terms Of Use</Text>
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
        title="Submission Error"
        message={alerttext}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        cancelText="No, cancel"
        confirmText="Ok"
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          doAlert('');
        }}
        onConfirmPressed={() => {
          doAlert('');
        }}
      />

      <Header />
      <View style={styles.outerView}>
        <View style={styles.innerView}>
          <Text style={styles.iconText}>ComicKhaya Terms of Use</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: 'tomato',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingBottom: 10,
    marginTop: 20,
  },
  iconText: {
    fontColor: '#023020',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
