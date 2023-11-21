import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import Apilink from '../config/Globals';

export default function Review({ navigation }) {
  const [bookid, setBookid] = useState('');
  const [book, setBook] = useState('');
  const [bookyear, setBookyear] = useState('');
  const [bookprice, setBookprice] = useState('');
  const [categ, setCateg] = useState('');
  const [descr, setDescr] = useState('');
  const [reveiewtext, setReveiewtext] = useState('');
  const [img, setImg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [showAlert, setShowAlert] = React.useState(false);
  const [alerttext, setAlerttext] = React.useState('');
  const [alerttitle, setAlerttitle] = React.useState('');
  const [indicate, setIndicate] = useState(false);

  const [indicating, setIndicating] = useState(false);
  const [ratetext, setRatetext] = React.useState('Submit Rating');

  const [userid, setUserid] = useState('');
  const [mail, setMail] = useState('');
  const [user, setUser] = useState('');

  const [rating, setRating] = useState(0);

  const doAlert = (txt, ttl) => {
    setShowAlert(!showAlert);
    setAlerttext(txt);
    setAlerttitle(ttl);
  };

  const Header = () => {
    return (
      <View style={styles.header}>
        <Ionicons name="chatbubble-ellipses-outline" size={25} color="black" />
        <Image
          style={styles.topIcon}
          source={require('../../assets/lggg.jpeg')}
        />
      </View>
    );
  };

  const sendFeedback = async () => {
    var apiLink = Apilink.getLink();
    if (reveiewtext !== '') {
      setIndicate(true);
      let res = await fetch(`${apiLink}review.php`, {
        method: 'post',
        body: JSON.stringify({
          alias: user,
          email: mail,
          bookid: bookid,
          userid: userid,
          review: reveiewtext,
        }),
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      let resJson = await res.json();
      setIndicate(false);
      if (resJson.message === 'Review submission successfull') {
        setReveiewtext('');
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

  const sendRating = async () => {
    var apiLink = Apilink.getLink();
    if (rating !== '') {
      setIndicating(true);
      let res = await fetch(`${apiLink}poststar.php`, {
        method: 'post',
        body: JSON.stringify({
          bookid: bookid,
          userid: userid,
          email: mail,
          rating: rating
        }),
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      let resJson = await res.json();
      setIndicating(false);
      if (resJson.message === 'Rating submission successfull') {
        setReveiewtext('');
        //navigation.navigate('Purchased');
        doAlert(resJson.message, 'Success Info');
      } else {
        doAlert(resJson.message, 'Error Info');
        return;
      }
    } else {
      doAlert(
        'Error. Provide book rating first before submission!',
        'Error Info'
      );
    }
  };

  useEffect(() => {
    const getBook = async () => {
      try {
        const savedBookId = await AsyncStorage.getItem('onpurchase');
        let authId = await AsyncStorage.getItem('UserID');
        let authMail = await AsyncStorage.getItem('UserMail');
        let authAlias = await AsyncStorage.getItem('UserName');
        setIsLoading(true);

        setUserid(authId);
        setMail(authMail);
        setUser(authAlias);

        //Look for book details
        const apiLink = Apilink.getLink();
        let bookresp = await fetch(`${apiLink}bookbyid.php?id=${savedBookId}`);
        let responseJson = await bookresp.json();

        if (responseJson.book.length > 0) {
          setBookid(responseJson.book[0].bookid);
          setBook(responseJson.book[0].book);
          setBookyear(responseJson.book[0].publishyear);
          setBookprice(responseJson.book[0].price);
          setCateg(responseJson.book[0].category);
          setDescr(responseJson.book[0].description);
          setImg(responseJson.book[0].coverimage);
          let rateresp = await fetch(`${apiLink}mystars.php?userid=${authId}&bookid=${savedBookId}`);
          let raterespJson = await rateresp.json();
          if (raterespJson.length > 0) {
              setRating(raterespJson[0].rating);
              if (parseInt(raterespJson[0].rating) > 0){
                setRatetext('Re-Submit Rating');
              }
          }

        }

        setIsLoading(false);
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
      <View style={styles.bookInfo}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 3,
              paddingBottom: 10,
            }}>
            <View style={{ flex: 3 }}>
              <Image style={styles.bookImg} source={{ uri: img }} />
            </View>
            <View style={{ flex: 4, marginLeft: 5 }}>
              <Text style={styles.titleText}>
                {book} {'(Publish Year: '}
                {bookyear}
                {')'}
              </Text>
              {categ == 1 && (
                <Text style={styles.categText}>Category: Superhero</Text>
              )}
              {categ == 2 && (
                <Text style={styles.categText}>Category: Slice-of-Life</Text>
              )}
              {categ == 3 && (
                <Text style={styles.categText}>Category: Humor</Text>
              )}
              {categ == 4 && (
                <Text style={styles.categText}>Category: Non-fiction</Text>
              )}
              {categ == 5 && (
                <Text style={styles.categText}>Category: Science-Fiction</Text>
              )}
              {categ == 6 && (
                <Text style={styles.categText}>Category: Horror</Text>
              )}
              {categ == 7 && (
                <Text style={styles.categText}>Category: Action</Text>
              )}
              <Text style={styles.writterText}>Writter: Tinashe Mtausi</Text>
              <Text style={styles.titleText}>
                Price: {' $'}
                {bookprice}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 10,
              borderBottomWidth: 1,
              borderBottomColor: 'tomato',
              paddingBottom: 10,
            }}>
            <Text style={styles.titleText}>Book Reviewing</Text>
            <Text style={styles.revText}>
              Thank you for purchasing this book. We hope you loved it! If you
              do, would you consider leaving us a review? This helps us to
              continue providing great content and helps others like you to find
              us and make confident decisions.{' '}
            </Text>
            <TextInput
              editable
              multiline
              numberOfLines={8}
              maxLength={40}
              onChangeText={(text) => setReveiewtext(text)}
              value={reveiewtext}
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
                {indicate == false && 'Submit Review'}
              </Text>
            </TouchableHighlight>
            <View
              style={{
                marginTop: 20,
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.revText}>Rate this book out of five </Text>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
               
                <Ionicons
                  name="star-outline"
                  size={25}
                  color={rating > 0 ? 'tomato' : 'black'}
                  style={{ marginLeft: 10 }}
                  onPress = {()=> setRating(1)}
                />
                <Ionicons
                  name="star-outline"
                  size={25}
                  color={rating > 1 ? 'tomato' : 'black'}
                  style={{ marginLeft: 10 }}
                  onPress = {()=> setRating(2)}
                />
                <Ionicons
                  name="star-outline"
                  size={25}
                  color={rating > 2 ? 'tomato' : 'black'}
                  style={{ marginLeft: 10 }}
                  onPress = {()=> setRating(3)}
                />
                <Ionicons
                  name="star-outline"
                  size={25}
                  color={rating > 3 ? 'tomato' : 'black'}
                  style={{ marginLeft: 10 }}
                  onPress = {()=> setRating(4)}
                />
                <Ionicons
                  name="star-outline"
                  size={25}
                  color={rating > 4 ? 'tomato' : 'black'}
                  style={{ marginLeft: 10 }}
                  onPress = {()=> setRating(5)}
                />
              </View>
              <View style={{ marginTop: 5, width: '100%' }}>
                <TouchableHighlight
                  style={styles.ratePressable}
                  onPress={() => {
                    sendRating();
                  }}>
                  <Text style={styles.buyBtnText}>
                    {' '}
                    {indicating && <ActivityIndicator color={'#fff'} />}
                    {indicating == false && ratetext}
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
      </View>
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
  bookInfo: {
    flexDirection: 'row',
    padding: 3,
    backgroundColor: '#FFFFED',
    borderRadius: 8,
    marginLeft: 7,
    marginRight: 7,
    marginTop: 5,
    width: '97%',
    height: '92%',
  },
  bookImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    borderRadius: 5,
  },
  titleText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 7,
    marginTop: 7,
  },
  writterText: {
    fontSize: 14,
    fontFamily: 'Cochin',
    marginTop: 10,
  },
  categText: {
    fontSize: 14,
    fontFamily: 'Cochin',
    color: 'tomato',
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
  ratePressable: {
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
