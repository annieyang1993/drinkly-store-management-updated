import React, {useContext, useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { ScrollView, Dimensions, TouchableOpacity, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { TouchableHighlight, Button, TextInput, Screen, Image, Platform} from 'react-native'
import {Firebase, db} from '../config/firebase';
import AuthContext from '../context/Context';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const Stack = createStackNavigator();

export default function StoreHome({navigation}) {
  const authContext = useContext(AuthContext)
  const auth = Firebase.auth();



    const getItems = async () => {
      const itemsTemp = [];
      const firebaseItems = await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('items').get();
      firebaseItems.docs.map((item, i)=>{
          itemsTemp.push(item.data());
          console.log(item.data());
      })
      authContext.setItems(itemsTemp);
    }

    const getHours = async () =>{
        const hours = {};
        const firebaseHours = await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('operating hours').get();
        firebaseHours.docs.map((day, i)=>{
            hours[day.id]=day.data();
        })
        await authContext.setStoreHours(hours);
    }

  return (
    <View style={{height: Dimensions.get("screen").height, width: '100%', marginTop: 'auto', backgroundColor: '#ecfdfe', paddingVertical: 50}}>
        <View style={{width: '100%', alignSelf: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginHorizontal: 20, paddingBottom: 0}}>Welcome, {authContext.storeData.name}!</Text>
            <ScrollView style={{height: '100%'}}>
           

            {/* <View style={{flexDirection: 'row'}}>
                <Text>Email</Text>
            </View>
            <View style={{flexDirection: 'row', width: '100%'}}>
            <Text style={{width: '80%', color: 'gray'}}>{authContext.storeData.street[0]}, {authContext.storeData.city}, {authContext.storeData.state}, {authContext.storeData.country}</Text>
            <TouchableOpacity style={{alignSelf: 'flex-end', width: '20%'}}>
            <Text style={{ fontSize: 13, alignSelf: 'flex-end', alignText: 'right', marginRight: 5}}>Edit</Text>
            </TouchableOpacity>
  </View> */}
         

           
            {authContext.storeData === undefined ? <View><Text></Text></View> :

            <View>
            <TouchableOpacity onPress={()=>navigation.navigate("Contact Info")} style={{width: '92%', alignSelf: 'center', backgroundColor: 'white', shadowColor: 'gray', shadowOffset: {width: 3, height: 5}, shadowRadius: 10, shadowOpacity: 0.3, borderRadius: 10, padding: 20, marginVertical: 15}}>

            <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{width: '80%'}}>
                <Text style={{fontWeight: 'bold', marginBottom: 10}}>Contact Info</Text>
                </View>
                <Text style={{ width: '20%', marginBottom: 10, fontSize: 13, alignSelf: 'flex-end', textAlign: 'right', marginRight: 5, color: 'gray', fontWeight: 'bold'}}>Edit</Text>
            </View>

            <Text>
            <View style={{flexDirection: 'row'}}>
             <Text>Address</Text>
            </View>
            <View style={{flexDirection: 'row', width: '100%'}}>
            <Text style={{width: '80%', color: 'gray', marginBottom: 10}}>{authContext.storeData.street}, {authContext.storeData.city}, {authContext.storeData.state}, {authContext.storeData.country}</Text>
            <TouchableOpacity style={{alignSelf: 'flex-end', width: '20%'}}>
            </TouchableOpacity>
            </View> 

             <View style={{flexDirection: 'row'}}>
                <Text >Phone</Text>
            </View>
            <View style={{flexDirection: 'row', width: '100%'}}>
            <Text style={{width: '80%', color: 'gray', marginBottom: 10}}>{authContext.storeData.phone}</Text>
            <TouchableOpacity style={{alignSelf: 'flex-end', width: '20%'}}>
            </TouchableOpacity>
            </View>

            <View style={{flexDirection: 'row'}}>
            <Text>Email</Text>
            </View>
            <View style={{flexDirection: 'row', width: '100%'}}>
            <Text style={{width: '80%', color: 'gray', marginBottom: 10}}>{authContext.storeData.email}</Text>
            <TouchableOpacity style={{alignSelf: 'flex-end', width: '20%'}}>
            </TouchableOpacity>
            </View>
            </Text></TouchableOpacity>

            <TouchableOpacity onPress={()=>navigation.navigate("Store Info")} style={{width: '92%', alignSelf: 'center', backgroundColor: 'white', shadowColor: 'gray', shadowOffset: {width: 3, height: 5}, shadowRadius: 10, shadowOpacity: 0.3, borderRadius: 10, padding: 20, marginVertical: 15}}>
            <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{width: '80%'}}>
                <Text style={{fontWeight: 'bold', marginBottom: 10}}>Store Info</Text>
                </View>
                <TouchableOpacity style={{width: '20%'}} >
                <Text style={{ fontSize: 13, alignSelf: 'flex-end', textAlign: 'right', marginRight: 5, color: 'gray', fontWeight: 'bold'}}>Edit</Text>
                </TouchableOpacity>
            </View>

            <Text style={{width: '100%'}}>
            <View style={{flexDirection: 'row', width: '100%'}}>
             <Text style={{width: '100%'}}>Description</Text>
            </View>
            <View style={{width: '100%'}}>
            <Text style={{width: '100%', color: 'gray'}} numberOfLines={2}>{authContext.storeData.description}</Text>
            </View> 

             <View style={{flexDirection: 'row', width: '100%'}}>
                <Text style={{marginTop: 10, width: '100%'}}>Price level</Text>
            </View>
            <View style={{flexDirection: 'row', width: '100%'}}>
            <Text style={{width: '100%', color: 'gray'}}>{authContext.storeData.price_level}</Text>
            </View>

             <View style={{flexDirection: 'row', width: '100%'}}>
                <Text style={{marginTop: 10, width: '100%'}}>Sections</Text>
            </View>
            <View style={{flexDirection: 'row', width: '100%'}}>

            {authContext.sections.map((section, i)=>{
                if (i===authContext.storeData.sections.length-1){
                    return(<Text key={i} style={{color: 'gray'}}>{section} </Text>)
                } else{
                    return(<Text key={i} style={{color: 'gray'}}>{section}, </Text>)
                }
            })}
            </View>



            </Text></TouchableOpacity>

            <TouchableOpacity onPress={()=>{getHours().then(navigation.navigate("Store Hours"))}} style={{width: '92%', alignSelf: 'center', backgroundColor: 'white', shadowColor: 'gray', shadowOffset: {width: 3, height: 5}, shadowRadius: 10, shadowOpacity: 0.3, borderRadius: 10, padding: 20, marginVertical: 15}}>
            <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{width: '80%'}}>
                <Text style={{fontWeight: 'bold'}}>Store hours</Text>
                </View>
                <Text style={{ width: '20%', fontSize: 13, alignSelf: 'flex-end', textAlign: 'right', marginRight: 5, color: 'gray', fontWeight: 'bold'}}>Edit</Text>
            </View>            
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{getItems().then( navigation.navigate("Items"))}} style={{width: '92%', alignSelf: 'center', backgroundColor: 'white', shadowColor: 'gray', shadowOffset: {width: 3, height: 5}, shadowRadius: 10, shadowOpacity: 0.3, borderRadius: 10, padding: 20, marginVertical: 15}}>
            <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{width: '80%'}}>
                <Text style={{fontWeight: 'bold'}}>Items</Text>
                </View>
                <Text style={{ width: '20%', fontSize: 13, alignSelf: 'flex-end', textAlign: 'right', marginRight: 5, color: 'gray', fontWeight: 'bold'}}>Edit</Text>
            </View>            
            </TouchableOpacity>


            <TouchableOpacity onPress={()=>navigation.navigate("Store Photos")} style={{width: '92%', alignSelf: 'center', backgroundColor: 'white', shadowColor: 'gray', shadowOffset: {width: 3, height: 5}, shadowRadius: 10, shadowOpacity: 0.3, borderRadius: 10, padding: 20, marginVertical: 15}}>
            <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={{width: '80%'}}>
                <Text style={{fontWeight: 'bold'}}>Store photos</Text>
                </View>
                <Text style={{ width: '20%', fontSize: 13, alignSelf: 'flex-end', textAlign: 'right', marginRight: 5, color: 'gray', fontWeight: 'bold'}}>Edit</Text>
            
            </View>
            </TouchableOpacity>



            </View>}

            </ScrollView>

            
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