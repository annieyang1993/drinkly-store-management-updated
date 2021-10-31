import React, {useContext} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserContext } from './AuthenticatedUserProvider';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { Dimensions, TouchableOpacity, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { TouchableHighlight, Button, TextInput, Screen, Image, Platform} from 'react-native'
import {Firebase, db} from '../config/firebase';
import AuthContext from '../context/Context';


const Stack = createStackNavigator();

export default function StoreNav() {
  const authContext = useContext(AuthContext)
  const auth = Firebase.auth();
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setLoggedIn(false);
    } catch (error) {
    }
  };

  return (
    <View style={{height: Dimensions.get("screen").height, width: '100%', marginTop: 'auto', backgroundColor: 'white', paddingVertical: 70}}>
        <View style={{width: '100%', alignSelf: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 10, marginHorizontal: 20, paddingTop: 50}}>Welcome, {authContext.storeData.name}</Text>
            
            <TouchableOpacity 
            onPress={()=>{handleSignOut()}}>
                <Text style={{margin: 20}}>X</Text>
            </TouchableOpacity>
            
            </View>
 
    </View>
    
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