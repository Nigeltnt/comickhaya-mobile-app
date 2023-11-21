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

export default function BookView() {
  const [bookid, setBookid] = useState('');
  const [book, setBook] = useState('');
  const [bookyear, setBookyear] = useState('');
  const [bookprice, setBookprice] = useState('');
  const [categ, setCateg] = useState('');
  const [descr, setDescr] = useState('');
  const [img, setImg] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

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

  useEffect(() => {
    const getBook = async () => {
      try {
        const savedBookId = await AsyncStorage.getItem('onpurchase');
        setIsLoading(true);

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
  }
});
