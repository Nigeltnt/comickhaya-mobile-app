import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  TouchableHighlight,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Apilink from '../../config/Globals';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

export default function Nonfiction() {
  let [mybooks, setMybooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [filtereddata, setFiltereddata] = useState([]);
  const [query, setQuery] = useState('');
  const navigation = useNavigation();

  const moveToBook = async (bookid) => {
    try {
      await AsyncStorage.setItem('onpurchase', bookid);
      let value = await AsyncStorage.getItem('UserID');
      if (value == null) {
        navigation.navigate('BookView');
      } else {
        navigation.navigate('OneBook');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Header = () => {
    return (
      <View style={styles.header}>
        <Ionicons name="library-outline" size={25} color="black" />

        <Image
          style={styles.topIcon}
          source={require('../../../assets/lggg.jpeg')}
        />
      </View>
    );
  };

  const SingleBook = ({ item }) => {
    return (
      <View style={styles.bookOuter}>
        <View>
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
          {item.category == 1 && <Text style={styles.descText}>Superhero</Text>}
          {item.category == 2 && (
            <Text style={styles.descText}>Slice-of-Life</Text>
          )}
          {item.category == 3 && <Text style={styles.descText}>Humor</Text>}
          {item.category == 4 && (
            <Text style={styles.descText}>Non-fiction</Text>
          )}
          {item.category == 5 && (
            <Text style={styles.descText}>Science-Fiction</Text>
          )}
          {item.category == 6 && <Text style={styles.descText}>Horror</Text>}
          {item.category == 7 && <Text style={styles.descText}>Action</Text>}
        </View>

        <TouchableHighlight
          style={styles.bookPressable}
          onPress={() => moveToBook(`${item.bookid}`)}>
          <Text style={styles.btnText}>View</Text>
        </TouchableHighlight>
      </View>
    );
  };

  const BooksView = () => {
    return (
      <View style={styles.contents}>
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

  const searchFilter = (text) => {
    if (text) {
      const newData = mybooks.filter((item) => {
        const itemData = item.book ? item.book.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      setFiltereddata(newData);
      setQuery(text);
    } else {
      setFiltereddata(mybooks);
      setQuery(text);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const apiLink = Apilink.getLink();

      const fetchData = async () => {
        setIsLoading(true);
        const authId = await AsyncStorage.getItem('UserID');
        var categ = '4';
        let resp = await fetch(`${apiLink}booksbycat.php?cat=${categ}`);
        let responseJson = await resp.json();
        setMybooks(responseJson);
        setFiltereddata(responseJson);
        setIsLoading(false);
      };

      fetchData();
      return () => {
        console.log('Screen was unfocused');
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <BooksView />
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
    width: '97%',
    height: '92%',
    padding: 5,
  },
  bookOuter: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFED',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 7,
    marginRight: 7,
    marginTop: 5,
    width: '100%',
  },
  bookDetails: {
    marginLeft: 15,
    justifyContent: 'flex-start',
    flex: 1,
    flexDirection: 'column',
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
    marginRight: 30,
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
