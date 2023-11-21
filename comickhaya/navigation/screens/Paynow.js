import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Image, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Paynow() {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const getUrl = async () => {
      try {
        let value = await AsyncStorage.getItem('uriobj');
        if (value !== null) {
          console.log(JSON.parse(value));
          value = JSON.parse(value);
          
          const paymentUrl = `https://app.softworkscapital.com/transect/payment.php?userid=${value.userid}&bookid=${value.bookid}&amount=${value.bookprice}&phone=${value.phone}&email=${value.mail}`;
          setUrl(paymentUrl);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUrl();
  }, []);

  const Header = () => {
    return (
      <View style={styles.header}>
        <Ionicons name="library-outline" size={25} color="black" />

        <Image
          style={styles.topIcon}
          source={require('../../assets/lggg.jpeg')}
        />
      </View>
    );
  };

  const WebPart = () => {
    return (
      <View style={styles.contents}>
        <WebView source={{ uri: url }} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <WebPart />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
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
  contents: {
    marginTop: 5,
    width: '100%',
    height: '92%',
    padding: 5,
  },
});
