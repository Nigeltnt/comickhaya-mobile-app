import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function More({ navigation }) {
  const [showAlert, setShowAlert] = React.useState(false);
  const [alerttext, setAlerttext] = React.useState('');

  const doAlert = (txt) => {
    setShowAlert(!showAlert);
    setAlerttext(txt);
  };

  const signOut = () => {
    AsyncStorage.getAllKeys().then((keys) => AsyncStorage.multiRemove(keys));
    navigation.navigate('TabScreens');
  };

   const Header = () => {
    return (
      <View style={styles.header}>
        <Ionicons name="apps-outline" size={25} color="black" />

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
        <TouchableOpacity
          style={styles.innerView}
          onPress={() => navigation.navigate('Info')}>
          <Ionicons name="sync-outline" size={25} color="black" />
          <Text style={styles.iconText}>
            Sync (Last synced 12-12-2000 12:14:34)
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.innerView}
          onPress={() => navigation.navigate('Lists')}>
          <Ionicons name="heart-outline" size={25} color="black" />
          <Text style={styles.iconText}>Your Lists</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.innerView}
          onPress={() => navigation.navigate('Settings')}>
          <Ionicons name="settings-outline" size={25} color="black" />
          <Text style={styles.iconText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.innerView}
          onPress={() => navigation.navigate('Feedback')}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={25}
            color="black"
          />
          <Text style={styles.iconText}>Help & Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.innerView}
          onPress={() => navigation.navigate('Info')}>
          <Ionicons name="information-circle-outline" size={25} color="black" />
          <Text style={styles.iconText}>Info</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.innerView}
          onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={25} color="black" />
          <Text style={styles.iconText}>Sign Out</Text>
        </TouchableOpacity>
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
  innerView: {
    width: '75%',
    borderBottomWidth: 1,
    borderBottomColor: 'tomato',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingBottom: 10,
    marginTop: 20,
  },
  outerView: {
    width: '100%',
    height: '90%',
    alignItems: 'center',
    marginTop: 10,
  },
  iconText: {
    fontColor: '#023020',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
