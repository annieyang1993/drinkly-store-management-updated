import React, {useContext, useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import {useNavigation, StackActions} from '@react-navigation/native'
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { ScrollView, Dimensions, TouchableOpacity, StyleSheet, Text, View, SafeAreaView, ActivityIndicator } from 'react-native';
import { TouchableHighlight, Button, TextInput, Screen, Image, Platform} from 'react-native'
import {Firebase, db} from '../config/firebase';
import AuthContext from '../context/Context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CachedImage from 'react-native-expo-cached-image'

const Stack = createStackNavigator();

export default function Items({navigation}) {
  const authContext = useContext(AuthContext)
  const [preferences, setPreferences] = useState({});
  const [loadingState, setLoadingState] = useState(new Array(authContext.items.length).fill(false))
  const auth = Firebase.auth();
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setLoggedIn(false);
    } catch (error) {
    }
  };

  const itemPreferences = async(item) =>{
      const preferencesTemp = [];
      const firebasePreferences = await Firebase.firestore().collection('restaurants')
      .doc(authContext.storeData.restaurant_id).collection('items').doc(item.name).collection('add-ons').get();

      firebasePreferences.docs.map((preference, i)=>{
         preferencesTemp.push(preference.data());
      })

      await setPreferences(preferencesTemp);
      return preferencesTemp;
  }

 

  return (
    <View style={{height: Dimensions.get("screen").height, width: '100%', marginTop: 'auto', backgroundColor: 'white', paddingVertical: 50}}>
        <View style={{width: '100%', alignSelf: 'center'}}>
            <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            <TouchableOpacity onPress={()=>navigation.pop(1)}>
            <MaterialCommunityIcons name="arrow-left" size={25}/>
            </TouchableOpacity>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginHorizontal: 10, paddingBottom: 10, marginTop: 3}}>Items</Text>
            </View>
            <ScrollView style={{height: '100%'}}>

                <View style={{flexDirection: 'row', width: '90%', alignSelf: 'center'}}>
                <TouchableOpacity onPress={()=>navigation.navigate("Add Item")}>
                <Text style={{marginTop: 20, color: 'gray'}}>+ Add Item</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{position: 'absolute', right: 0, marginTop: 20}} onPress={()=>navigation.navigate("Add Preference")}>
                <Text style={{color: 'gray'}}>+ Add Preference</Text>
                </TouchableOpacity>
                </View>

                <View style={{width: '95%', alignSelf: 'center', marginTop: 20}}>
                {authContext.items.map((item, i)=>{
                    if (item["img"]===undefined){
                        return(
                            <TouchableOpacity key={i} onPress={()=>{itemPreferences(item).then((preferences)=> navigation.navigate("Item Modal", {item: item, preferences: preferences}))}}>
                            <View style={{width: '100%', height: 100, flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray'}}>
                                <View style={{width: '28%', alignSelf: 'center', height: '95%', borderWidth: 1, borderColor: 'lightgray', borderRadius: 5}}>
                                    <Text style={{color: 'gray', alignSelf: 'center', marginTop: 25}}>No image</Text>
                                </View>
                                <View style={{width: '70%', marginRight: '1%', marginLeft: '2%'}}> 
                                <Text key={item["name"]} style={{fontSize: 15, fontWeight: 'bold', marginTop: 5}} numberOfLines={1}>{item["name"]} </Text>
                                <Text style={{marginTop: 10, color: 'gray'}}>Edit details</Text> 
                                </View> 
                                </View> 
                        </TouchableOpacity>
                        )

                    } else{
                    return (
                        <TouchableOpacity key={i} onPress={()=>{authContext.setCurrentItem(item); itemPreferences(item).then((preferences)=> navigation.navigate("Item Modal", {item: item, preferences: preferences, uriText: 'Please select an image from your photos'}))}}>
                            <View style={{width: '100%', height: 100, flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray'}}>
                            <View style={{flexDirection: 'row', width: '100%'}}> 
                            <CachedImage style={{width: '28%', height: '95%', borderRadius: 5}} source={{uri: item["img"]}}  onLoadStart={() => {
                                const loadingStateTemp = loadingState.map((x)=>x);
                                loadingStateTemp[i] = true;
                                setLoadingState(loadingStateTemp)}} 
                                onLoadEnd={() => {
                                const loadingStateTemp = loadingState.map((x)=>x);
                                loadingStateTemp[i] = false;
                                setLoadingState(loadingStateTemp)
                               }}/>

                            {loadingState[i] ? <ActivityIndicator size='small' style={{marginLeft: '-14%', marginRight: '14%'}}/> : null}
                            
                         
                            <View style={{width: '70%', marginRight: '1%', marginLeft: '2%'}}> 
                            <Text key={item["name"]} style={{fontSize: 15, fontWeight: 'bold', marginTop: 5}} numberOfLines={1}>{item["name"]} </Text>
                            <Text style={{marginTop: 10, color: 'gray'}}>Edit details</Text> 
                            </View> 
                            </View> 
                           
                        </View> 
                        </TouchableOpacity>
                    )
                    }
                })}

                <View style={{height: 100}}></View>
                </View>

            </ScrollView>

            
            </View>
 
    </View>
    
  );
}
