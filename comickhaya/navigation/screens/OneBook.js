import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apilink from '../config/Globals';

export default function OneBook() {
  const [bookid, setBookid] = useState('');
  const [book, setBook] = useState('');
  const [bookyear, setBookyear] = useState('');
  const [bookprice, setBookprice] = useState('');
  const [categ, setCateg] = useState('');
  const [descr, setDescr] = useState('');
  const [img, setImg] = useState('');
  const [bookrate, setBookrate] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [userid, setUserid] = useState('');
  const [mail, setMail] = useState('');
  const [phone, setPhone] = useState('');

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

  const SingleReview = ({ item }) => {
    return (
      <View style={styles.reviewContainer}>
        <View>
          <Text style={styles.aliasText}>
            {item.alias} {' - '}
            {item.datesaved}
          </Text>
        </View>
        <View>
          <Text style={styles.reviewText}>{item.review}</Text>
        </View>
      </View>
    );
  };

  const purchaseBook = async () => {
    Alert.alert(userid + '' + bookid + '' + bookprice + '' + phone + '' + mail);
    const obj = {
      userid,
      bookid,
      bookprice,
      phone,
      mail,
    };
 
    //set uri in async storage
    try {
      await AsyncStorage.setItem('uriobj', JSON.stringify(obj));
      navigation.navigate('Paynow');
    } catch (error) {
      console.log(error);
      Alert.alert(error);
    }
  };

  useEffect(() => {
    const getBook = async () => {
      try {
        const savedBookId = await AsyncStorage.getItem('onpurchase');

        let authId = await AsyncStorage.getItem('UserID');
        let authMail = await AsyncStorage.getItem('UserMail');
        let authPhone = await AsyncStorage.getItem('UserPhone');
        setIsLoading(true);

        setUserid(authId);
        setMail(authMail);
        setPhone(authPhone);

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
          if (parseInt(responseJson.book[0].rating) == 0){
            setBookrate(0);
          }
          if (parseInt(responseJson.book[0].rating) < 20){
            setBookrate(1);
          }
          if (parseInt(responseJson.book[0].rating) < 40){
            setBookrate(2);
          }
          if (parseInt(responseJson.book[0].rating) < 60){
            setBookrate(3);
          }
          if (parseInt(responseJson.book[0].rating) < 80){
            setBookrate(4);
          }
          if (parseInt(responseJson.book[0].rating) > 79){
            setBookrate(5);
          }
          
        }
        if (responseJson.reviews.length > 0) {
          setReviews(responseJson.reviews);
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
            <View style={{ flex: 4 }}>
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
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
               
                <Ionicons
                  name="star-outline"
                  size={15}
                  color={bookrate > 0 ? 'tomato' : 'black'}
                  style={{ marginLeft: 10 }}
                />
                <Ionicons
                  name="star-outline"
                  size={15}
                  color={bookrate  > 1 ? 'tomato' : 'black'}
                  style={{ marginLeft: 10 }}
                />
                <Ionicons
                  name="star-outline"
                  size={15}
                  color={bookrate  > 2 ? 'tomato' : 'black'}
                  style={{ marginLeft: 10 }}
                  onPress = {()=> setRating(3)}
                />
                <Ionicons
                  name="star-outline"
                  size={15}
                  color={bookrate  > 3 ? 'tomato' : 'black'}
                  style={{ marginLeft: 10 }}
                />
                <Ionicons
                  name="star-outline"
                  size={15}
                  color={bookrate > 4 ? 'tomato' : 'black'}
                  style={{ marginLeft: 10 }}
                />
              </View>
              <Text style={styles.writterText}>Writter: Tinashe Mtausi</Text>
              <Text style={styles.titleText}>
                Price: {' $'}
                {bookprice}
              </Text>

              <TouchableHighlight
                style={styles.buyPressable}
                onPress={() => {
                  purchaseBook();
                }}>
                <Text style={styles.buyBtnText}>Purchase Book</Text>
              </TouchableHighlight>
            </View>
          </View>

          <View
            style={{
              flex: 10,
              borderBottomWidth: 1,
              borderBottomColor: 'tomato',
              paddingBottom: 10,
            }}>
            <Text style={styles.titleText}>About the book</Text>
            <Text style={styles.descrText}>{descr}</Text>
            <Text style={styles.titleText}>Book Reviews</Text>
            {isLoading ? (
              <>
                <ActivityIndicator
                  size="large"
                  color="#bb5533"
                  style={styles.indicator}
                />
                <Text style={{ color: 'gray' }}>Loading...</Text>
              </>
            ) : error ? (
              <Text>Something went wrong</Text>
            ) : (
              <>
                <FlatList
                  data={reviews}
                  renderItem={SingleReview}
                  keyExtractor={(item) => item?.reviewid}
                  contentContainerStyle={{ columnGap: 16 }}
                  vertical
                />
              </>
            )}
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
    marginLeft: 7,
  },
  descrText: {
    marginBottom: 10,
    marginLeft: 5,
  },
  writterText: {
    fontSize: 14,
    fontFamily: 'Cochin',
    marginLeft: 7,
    marginTop: 10,
  },
  categText: {
    fontSize: 14,
    fontFamily: 'Cochin',
    marginLeft: 7,
    color: 'tomato',
  },
  indicator: {
    padding: 12,
    backgroundColor: '#555',
    borderRadius: 12,
    width: 80,
    marginTop: 20,
  },
  reviewContainer: {
    flexDirection: 'column',
    padding: 10,
    backgroundColor: '#C3B091',
    borderRadius: 8,
    marginLeft: 4,
    marginRight: 4,
    marginTop: 5,
    width: '97%',
  },
  aliasText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 7,
    marginTop: 7,
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'Cochin',
  },
  buyPressable: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'tomato',
    borderWidth: 1,
    borderRadius: 6,
    margin: 7,
    height: 37,
  },
  buyBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'tomato',
    textAlign: 'center',
    marginTop: 3,
  },
});
