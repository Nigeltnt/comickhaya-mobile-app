import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  WebView,
  Text,
  SafeAreaView,
  Image,
  Alert,
  TouchableHighlight,
  FlatList,
  ScrollView,
  TextInput,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import Superhero from './Booktypes/Superhero';
import Sliceoflife from './Booktypes/Sliceoflife';
import Humor from './Booktypes/Humor';
import Nonfiction from './Booktypes/Nonfiction';
import Science from './Booktypes/Science';
import Horror from './Booktypes/Horror';
import Action from './Booktypes/Action';
import Apilink from '../config/Globals';

export default function Dashboard() {

  const [searchkey, setSearchkey] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  let [superheroes, setSuperheroes] = useState([]);
  let [filteredData, setFiltereddata] = useState([]);

  const navigation = useNavigation();

  const btns = [
    'All-Categories',
    'Superhero',
    'Slice-of-Life',
    'Humor',
    'Non-fiction',
    'Science-Fiction',
    'Horror',
    'Action',
  ];
  

  const searchcateg = (item) => {
    if (item == 'All-Categories') {
      navigation.navigate('A_categ');
    }
    if (item == 'Superhero') {
      navigation.navigate('S_hero');
    }
    if (item == 'Slice-of-Life') {
      navigation.navigate('S_life');
    }
    if (item == 'Humor') {
      navigation.navigate('H_umor');
    }
    if (item == 'Non-fiction') {
      navigation.navigate('N_fict');
    }
    if (item == 'Science-Fiction') {
      navigation.navigate('S_fict');
    }
    if (item == 'Horror') {
      navigation.navigate('H_orror');
    }
    if (item == 'Action') {
      navigation.navigate('A_ction');
    }
  };

  const searchFilter = (text) => {
    if (text) {
      const newData = superheroes.filter((item) => {
        const itemData = item.book ? item.book.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      setFiltereddata(newData);
      setSearchkey(text);
    } else {
      setFiltereddata(superheroes);
      setSearchkey(text);
    }
  };


  useEffect(() => {
    // POPULAR BOOKS
    const apiLink = Apilink.getLink();
    const fetchData = async () => {
      setIsLoading(true);
      let resp = await fetch(`${apiLink}books.php`);

      let responseJson = await resp.json();

      setSuperheroes(responseJson);
      setFiltereddata(responseJson);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const movePrev = () => {
    if (page == 2) {
      setPage(1);
    }
    if (page == 3) {
      setPage(2);
    }
  };
  const moveNext = () => {
    if (page == 1) {
      setPage(2);
    }
    if (page == 2) {
      setPage(3);
    }
  };

  const MoveBtns = () => {
    return (
      <View style={styles.prevNxt}>
        <View>
          <TouchableHighlight
            style={styles.categPressable}
            onPress={() => movePrev()}>
            <Ionicons
              name="arrow-back-circle-outline"
              size={30}
              color="black"
            />
          </TouchableHighlight>
        </View>
        <View>
          <TouchableHighlight
            style={styles.categPressable}
            onPress={() => moveNext()}>
            <Ionicons
              name="arrow-forward-circle-outline"
              size={30}
              color="black"
            />
          </TouchableHighlight>
        </View>
      </View>
    );
  };

  const WelcomeView = () => {
    return (
      <View style={styles.inview}>
        <Text style={styles.welcomehead}>Welcome To ComicKhaya!</Text>
        <Text style={styles.welcometext}>
          Your recent books, magazines, and comics will appear here. To get
          started, browse recommended books below and shop the store
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        marginTop: 20,
        borderColor: 'tomato',
        borderWidth: 1,
        backgroundColor: '#F9F5EB',
        borderRadius: 10,
        height: 40,
        width: 120,
      }}>
      <TouchableHighlight
        style={styles.categPressable}
        onPress={() => searchcateg(item)}>
        <Text style={styles.categBtnText}>{item}</Text>
      </TouchableHighlight>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="library-outline" size={25} color="black" />
        <View
          style={{
            padding: 5,
            margin: 5,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderWidth: 0.8,
            backgroundColor: 'white',
            borderRadius: 10,
            width: '70%',
            height: 50,
          }}>
          <TextInput
            style={styles.inputs}
            placeholder="Search ComicKhaya ..."
            placeholderTextColor="#888888"
            underlineColorAndroid="transparent"
            value={searchkey}
            onChangeText={(text) => searchFilter(text)}
          />
          <Ionicons
            name="search"
            size={30}
            color="black"
          />
        </View>
        <Image
          style={styles.topIcon}
          source={require('../../assets/lggg.jpeg')}
        />
      </View>
      <WelcomeView />
      <ScrollView style={styles.bigview}>
        <View>
          <FlatList
            data={btns}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            contentContainerStyle={{ columnGap: 16 }}
            horizontal
            ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
          />
        </View>
        {page == 1 && (
          <>
            <Superhero superheroes={filteredData} isLoading={isLoading} />
            <Sliceoflife superheroes={filteredData} isLoading={isLoading} />
            <Humor superheroes={filteredData} isLoading={isLoading} />
          </>
        )}
        {page == 2 && (
          <>
            <Nonfiction superheroes={filteredData} isLoading={isLoading} />
            <Science superheroes={filteredData} isLoading={isLoading} />
            <Horror superheroes={filteredData} isLoading={isLoading} />
          </>
        )}
        {page == 3 && (
          <>
            <Action superheroes={filteredData} isLoading={isLoading} />
          </>
        )}
        <MoveBtns />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 5,
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
  prevNxt: {
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
    marginTop: 5,
  },
  inview: {
    width: '100%',
    height: '8%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  bigview: {
    width: '100%',
    height: '80%',
  },
  welcomehead: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
  },
  welcometext: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 12,
  },
  categPressable: {
    marginRight: 5,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'tomato',
    textAlign: 'center',
    marginTop: 10,
  },
  inputs: {
    fontColor: '#023020',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
