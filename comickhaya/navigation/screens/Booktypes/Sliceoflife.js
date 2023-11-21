import * as React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Sliceoflife(props) {

  const error = false;
  const navigation = useNavigation();

  const filteredData = props.superheroes.filter(obj => {
    return obj.category == 2;
  });

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
  
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => moveToBook(`${item.bookid}`)}
      style={{
        flex: 1,
        flexDirection: 'column',
        marginTop: 10,
        borderColor: 'tomato',
        borderWidth: 1,
        backgroundColor: '#F9F5EB',
        borderRadius: 3,
        height: 160,
        width: 110,
      }}>
      <View>
        <Image
          style={{
            width: '100%',
            height: 158,
            resizeMode: 'stretch',
            borderRadius: 3,
          }}
          source={{ uri: item.coverimage }}
        />
      </View>
      
    </TouchableOpacity>
  );

  const BooksView = () => {
    return (
      filteredData.length > 0 ? (
      <View style={styles.books}>
        <View style={styles.booksViewHeader}>
          <Text style={styles.booksHeader}>Slice-of-life</Text>
          
        </View>
        <View style={styles.cardsContainer}>
          {props.isLoading ? (
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
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item?.id}
                contentContainerStyle={{ columnGap: 16 }}
                horizontal
                ItemSeparatorComponent={() => <View style={{width: 15}} />}
              />
            </>
          )}
        </View>
      </View>
      ):''
    );
  };

  return <BooksView />;
}

const styles = StyleSheet.create({
  books: {
    width: '100%',
    height: '25%',
    backgroundColor: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 10,
    marginTop: 7,
  },
  booksViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  booksHeader: {
    color: '#5a5a5a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  indicator: {
    padding: 12,
    backgroundColor: '#555',
    borderRadius: 12,
    width: 80,
    marginTop: 20,
  }
});
