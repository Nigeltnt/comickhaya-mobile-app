import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

//Screens
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import DetailsScreen from './screens/DetailsScreen';
import PopularBooks from './screens/PopularBooks';
import About from './screens/About';
import Terms from './screens/Terms';
import Privacy from './screens/Privacy';
import Otp from './screens/Otp';
import BookView from './screens/BookView';
import Paynow from './screens/Paynow';
import OneBook from './screens/OneBook';
import Review from './screens/Review';

import Dashboard from './screens/Dashboard';
import Purchased from './screens/Purchased';
import More from './screens/More';
import Read from './screens/Read';
import Info from './screens/Info';
import Feedback from './screens/Feedback';
import Settings from './screens/Settings';
import Lists from './screens/Lists';

//Categories Lists Screens
import S_hero from './screens/Categories/Superhero';
import S_life from './screens/Categories/Sliceoflife';
import H_umor from './screens/Categories/Humor';
import N_fict from './screens/Categories/Nonfiction';
import S_fict from './screens/Categories/Scifiction';
import H_orror from './screens/Categories/Horror';
import A_ction from './screens/Categories/Action';
import A_categ from './screens/Categories/All';

//Screen names
const homeName = 'Home';
const authName = 'Library';
const detailsName = 'More';

const dashName = 'Dashboard';
const colName = 'Purchased';
const moreName = 'More';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabScreens = () => {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === authName) {
            iconName = focused ? 'library' : 'library-outline';
          } else if (rn === detailsName) {
            iconName = focused ? 'list' : 'list-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'grey',
        labelStyle: { paddingBottom: 10, fontSize: 14, marginTop: 10 },
        style: { padding: 10, height: 70 },
      }}>
      <Tab.Screen name={homeName} component={HomeScreen} />
      <Tab.Screen name={authName} component={AuthScreen} />
      <Tab.Screen name={detailsName} component={DetailsScreen} />
    </Tab.Navigator>
  );
};

const DashTabScreens = () => {
  return (
    <Tab.Navigator
      initialRouteName={dashName}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === dashName) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (rn === colName) {
            iconName = focused ? 'library' : 'library-outline';
          } else if (rn === moreName) {
            iconName = focused ? 'list' : 'list-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'grey',
        labelStyle: { paddingBottom: 10, fontSize: 14, marginTop: 10 },
        style: { padding: 10, height: 70 },
      }}>
      <Tab.Screen name={dashName} component={Dashboard} />
      <Tab.Screen name={colName} component={Purchased} />
      <Tab.Screen name={moreName} component={More} />
    </Tab.Navigator>
  );
};

function MainContainer() {
  return <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="TabScreens" component={TabScreens} />
        <Stack.Screen name="PopularBooks" component={PopularBooks} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Terms" component={Terms} />
        <Stack.Screen name="Privacy" component={Privacy} />
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="Read" component={Read} />
        <Stack.Screen name="Info" component={Info} />
        <Stack.Screen name="Feedback" component={Feedback} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Lists" component={Lists} />
        <Stack.Screen name="BookView" component={BookView} />
        <Stack.Screen name="OneBook" component={OneBook} />
        <Stack.Screen name="Paynow" component={Paynow} />
        <Stack.Screen name="Review" component={Review} />
        <Stack.Screen name="S_hero" component={S_hero} />
        <Stack.Screen name="S_life" component={S_life} />
        <Stack.Screen name="H_umor" component={H_umor} />
        <Stack.Screen name="N_fict" component={N_fict} />
        <Stack.Screen name="S_fict" component={S_fict} />
        <Stack.Screen name="H_orror" component={H_orror} />
        <Stack.Screen name="A_ction" component={A_ction} />
        <Stack.Screen name="A_categ" component={A_categ} />
        <Stack.Screen name="DashTabScreens" component={DashTabScreens} />
      </Stack.Navigator>
    </NavigationContainer>;
}

export default MainContainer;
