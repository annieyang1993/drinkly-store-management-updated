import React, {useContext, useEffect, useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserContext } from './AuthenticatedUserProvider';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { TouchableOpacity, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Dimensions, TouchableHighlight, Button, TextInput, Screen, Image, Platform} from 'react-native'
import {Firebase, db} from '../config/firebase';
import AuthContext from '../context/Context';

import StoreNavigation from './MyStore'
import OrderNavigation from './MyOrders'
import AccountNavigation from './MyAccount'

const Tab = createBottomTabNavigator();

export default function AuthStack() {
  const authContext = useContext(AuthContext)
  const [storeData, setStoreData] = useState({});
  const [items, setItems] = useState([]);
  const [userData, setUserData] = useState({});
  const [sections, setSections] = useState([]);
  const [restaurantPreferences, setRestaurantPreferences] = useState([]);
  const [currentItem, setCurrentItem] = useState({})
  const [storeHours, setStoreHours] = useState({})
  const auth = Firebase.auth();
  const { user, setUser, loggedIn, setLoggedIn } = useContext(AuthenticatedUserContext);

  const getStore = async() => {
      const userTemp = await Firebase.firestore().collection('users')
      .doc(user.uid).get();
      setUserData(userTemp.data());
      const restaurantTemp = await Firebase.firestore().collection('restaurants')
      .doc(userTemp.data().restaurant_id).get();
      setStoreData(restaurantTemp.data());
      setSections(restaurantTemp.data().sections);

      const restPreferences = await Firebase.firestore().collection('restaurants').doc(restaurantTemp.data().restaurant_id).collection('add-ons').get();
      const restaurantPreferencesTemp = [];
      restPreferences.docs.map((pref, j)=>{
          restaurantPreferencesTemp.push(pref.data())
      })
      setRestaurantPreferences(restaurantPreferencesTemp);

      const hours = {};
        const firebaseHours = await Firebase.firestore().collection('restaurants').doc(restaurantTemp.data().restaurant_id).collection('operating hours').get();
        firebaseHours.docs.map((day, i)=>{
            hours[day.id]=day.data();
        })

        console.log("HOME STACK", hours);
        await setStoreHours(hours);
  }

    const getHours = async () =>{
        const hours = {};
        const firebaseHours = await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('operating hours').get();
        firebaseHours.docs.map((day, i)=>{
            hours[day.id]=day.data();
        })

        console.log("HOME STACK", hours);
        await setStoreHours(hours);
    }

  useEffect(async ()=>{
      console.log('reloaded home stack')
      await getStore();

  }, [])





  return (
      <AuthContext.Provider value={{storeData, setStoreData, userData, setUserData, sections, setSections, getStore, 
      items, setItems, restaurantPreferences, setRestaurantPreferences, currentItem, setCurrentItem,
      storeHours, setStoreHours}}>
        <View style={{height: Dimensions.get("screen").height}}>
            <Tab.Navigator
                independent={true}
                activeBackgroundColor='red'
                screenOptions={{
                tintColor: 'red',
                activeColor: 'red',
                activeTintcolor: 'white',
                inactiveBackgroundColor: 'blue',
                inactiveTintColor: 'black',
                safeAreaInsets: {
                    bottom: 0,
                    top: 0
                },
                tabBarActiveTintColor:'#119aa3',
                headerShown: false  
                }}>
                
                <Tab.Screen 
                    name="My Store" 
                    component={StoreNavigation}
                    options={{headerMode: 'none', tabBarIcon: ({size, color})=> <MaterialCommunityIcons size={20} name="store" color={color}/>}}/>
                <Tab.Screen 
                    name="My Orders" 
                    component={OrderNavigation}
                    options={{headerMode: 'none', tabBarIcon: ({size, color})=> <MaterialCommunityIcons size={20} name="receipt" color={color}/>}}/>
                <Tab.Screen 
                    name="My Account" 
                    component={AccountNavigation}
                    options={{headerMode: 'none', tabBarIcon: ({size, color})=> <MaterialCommunityIcons size={20} name="account" color={color}/>}}/>
            </Tab.Navigator>

        </View>
        </AuthContext.Provider>
    
  );
}
  
  const styles = StyleSheet.create({
  screen: {
    paddingTop: 50,
    //backgroundColor: "brown",
    textAlignVertical: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: "100%"
  },

  image: {
      width: Dimensions.get("screen").width*0.85,
      height: Dimensions.get("screen").width*0.85,
      resizeMode: 'contain',
      flexDirection: 'column',
      alignSelf: 'center',
      opacity: .3,
      borderColor: "gray",
      marginVertical: "20%",
      position: 'absolute',
      top: "15%",
      borderRadius: 250

  },

  login: {
    position: 'absolute',
    backgroundColor: "#a1a8a8",
    borderRadius: 25,
    flexDirection: "row",
    width: '95%',
    padding: 15,
    marginVertical: 5,
    bottom: 30,
    color: "white",
    textDecorationColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
    
  },

  register: {
    position: 'absolute',
    backgroundColor: "#44bec6",
    borderRadius: 25,
    flexDirection: "row",
    width: '95%',
    padding: 15,
    bottom: 90,
    textDecorationColor: 'white',
    fontWeight: 'bold',
    justifyContent: 'center',  
  },

  loginText: {
      textDecorationColor: 'white',
      fontWeight: 'bold',
      
  },

  registerText: {
      color: 'white',
      textDecorationColor: 'white',
      fontWeight: 'bold',
      
  },

  loginText: {
      color: 'black',
      textDecorationColor: 'white',
      fontWeight: 'bold',
      
  },

  logo: {
    width: "40%",
    height: "8%",
    resizeMode: 'contain',
    alignSelf: 'center'
    
  }
  
})