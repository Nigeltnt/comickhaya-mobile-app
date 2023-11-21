import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function PopularBooks({ navigation }) {
  const [txt, setTxt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  let [populars, setPopulars] = useState([]);
  const [filtereddata, setFiltereddata] = useState([]);
  const [query, setQuery] = useState("");

  const error = false;

  const searchFilter = (text) => {
      if (text) {
        const newData = filtereddata.filter((item) => {
          const itemData = item.book
            ? item.book.toUpperCase()
            : "".toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
  
        setFiltereddata(newData);
        setQuery(text);
      } else {
        setFiltereddata(populars);
        setQuery(text);
      }
    };

  const Header = () => {
    return (
      <View style={styles.header}>
        <View style={styles.inputContainer}>
          <Image
            style={styles.topIcon}
            source={require('../../assets/lggg.jpeg')}
            resizeMode="contain"
          />
          <TextInput
            style={styles.inputs}
            placeholder="Search ComicKhaya ..."
            placeholderTextColor="#888888"
            underlineColorAndroid="transparent"
            value={query}
            onChangeText={(text) => searchFilter(text)}
          />

          <TouchableHighlight
            style={styles.loginButton}
            onPress={() => doSearch()}>
            <Ionicons name="search" size={30} color="black" />
          </TouchableHighlight>
        </View>
      </View>
    );
  };

  const SingleBook = ({ item }) => {
    return (
      <Pressable style={styles.bookOuter}>
        <View style={styles.bookImg}>
          <Image
            style={{
              width: 100,
              height: 100,
              resizeMode: 'stretch',
              borderRadius: 5,
            }}
            source={{ uri: item.coverimage }}
          />
        </View>
        <View style={styles.bookDetails}>
          <Text style={styles.titleText}>{item.book}</Text>
          <Text style={styles.descText}>{item.category}</Text>
        </View>
        <Pressable style={styles.bookPressable}>
          <Text style={styles.btnText}>Add</Text>
        </Pressable>
      </Pressable>
    );
  };

  // POPULAR BOOKS
  const fetchData = async () => {
    setIsLoading(true);
    let resp = await fetch(
      'https://app.softworkscapital.com/endpoints/books.php'
    );

    let responseJson = await resp.json();

    setPopulars(responseJson);
    setFiltereddata(responseJson);
    setIsLoading(false);
  };

  const PopularBooksView = () => {
    return (
      <View>
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
              data={filtereddata}
              renderItem={SingleBook}
              keyExtractor={(item) => item?.id}
              contentContainerStyle={{ columnGap: 16 }}
              vertical
            />
          </>
        )}
      </View>
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.afterheader}>
        <Text style={styles.caption}>All Popular Books</Text>
      </View>
      <View style={styles.popularBooks}>
        <PopularBooksView />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 23,
    flexDirection: 'column',
  },
  header: {
    width: '100%',
    height: '10%',
    backgroundColor: 'tomato',
    alignItems: 'center',
    justifyContent: 'center',
  },
  afterheader: {
    width: '100%',
    height: '5%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popularBooks: {
    width: '100%',
    height: '85%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderBottomWidth: 1,
    width: '97%',
    height: 50,
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
    fontColor: '#023020',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: 'white',
    width: 60,
    padding: 10,
    borderRadius: 7,
    marginRight: 1,
  },
  topIcon: {
    width: 100,
    height: '100%',
    marginBottom: 5,
    marginTop: 5,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  caption: {
    marginTop: 15,
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontSize: 22,
  },
  bookOuter: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFED',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 14,
    width: '100%',
  },
  titleText: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: 7,
    marginTop: 7,
  },
  descText: {
    fontSize: 14,
    fontFamily: 'Cochin',
    marginLeft: 7,
    fontColor: 'green',
  },
  bookPressable: {
    width: 80,
    borderRadius: 6,
    marginRight: 15
  },
  bookDetails: {
    marginLeft: 15,
    justifyContent: 'flex-start',
    flex: 1,
    flexDirection: 'column'
  },
  btnText: {
    fontSize: 17,
    fontWeight: 'bold',
    borderColor: 'gray',
    borderWidth: 0.8,
    marginVertical: 10,
    color: 'tomato',
    textAlign: 'center',
    padding: 5,
    borderRadius: 4,
  },
  indicator: {
    padding: 12,
    backgroundColor: '#555',
    borderRadius: 12,
    width: 80,
    marginTop: 20,
  },
});
