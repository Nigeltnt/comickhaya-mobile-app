import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  WebView,
  Text,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import PDFReader from 'rn-pdf-reader-js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScreenCapture from 'expo-screen-capture';
import { useIsFocused } from '@react-navigation/native';

export default function Read() {
  const [bookid, setBookid] = useState('');
  const [book, setBook] = useState('');

  const isFocused = useIsFocused();

  const activate = async () => {
    await ScreenCapture.preventScreenCaptureAsync();
  };

  const deactivate = async () => {
    await ScreenCapture.allowScreenCaptureAsync();
  };

  if (isFocused) {
    activate();
  } else {
    deactivate();
  }

  useEffect(() => {
    const fetchData = async () => {
      const value = await AsyncStorage.getItem('bookdetails');
      const booknan = value.split('~').pop();
      let id = value.split('~')[0];
      id = id.replace(/\s/g, '');
      setBookid(id);
      setBook(booknan);
    };
    fetchData();
  }, []);

  const Header = () => {
    return (
      <View style={styles.header}>
        <View style={styles.headContainer}>
          <Ionicons name="library-outline" size={25} color="black" />
          <Text style={styles.iconText}>{book}</Text>

          <Image
            style={styles.topIcon}
            source={require('../../assets/lggg.jpeg')}
          />
        </View>
      </View>
    );
  };

  const PDFView = () => {
    return (
      <View style={styles.pdf}>
        <PDFReader
          source={{
            uri: `https://app.softworkscapital.com/storage/bookpdf/${bookid}.pdf`,
          }}
          onLoad={() => {
            console.log('Wait while the book is being loaded....');
          }}
          onError={() => {
            Alert.alert('Wait while the book is being loaded....');
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <PDFView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 5,
    backgroundColor: '#ecf0f1',
    padding: 8,
    marginTop: 23,
  },
  header: {
    width: '100%',
    height: '12%',
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdf: {
    width: '100%',
    height: '88%',
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
  topIcon: {
    width: 100,
    height: '100%',
    marginBottom: 5,
    marginTop: 5,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  iconText: {
    fontColor: '#023020',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
