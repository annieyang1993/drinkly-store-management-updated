import React, {useContext, useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import {useNavigation, StackActions} from '@react-navigation/native'
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { Modal, ScrollView, Dimensions, TouchableOpacity, StyleSheet, Text, View, SafeAreaView, ActivityIndicator } from 'react-native';
import { TouchableHighlight, Button, TextInput, Screen, Image, Platform} from 'react-native'
import {Firebase, db} from '../config/firebase';
import AuthContext from '../context/Context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CachedImage from 'react-native-expo-cached-image';
import InputField from '../components/InputField'
import Routes from '../navigation';

export default function AddExistingPreference({route}) {
  const authContext = useContext(AuthContext)
  const navigation = useNavigation();
  const [preferences, setPreferences] = useState(route.params.preferences);
  const [loadingState, setLoadingState] = useState(new Array(authContext.items.length).fill(false))

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [required, setRequired] = useState(true);
  const [number, setNumber] = useState(1);
  const [repeat, setRepeat] = useState(false);
  const [preferenceChoices, setPreferenceChoices] = useState([]);
  const [preferencePrices, setPreferencePrices] = useState([]);
  const [choice, setChoice] = useState('');
  const [price, setPrice] = useState(0);
  const [addPreferenceModal, setAddPreferenceModal] = useState(false);
  const [choiceIndex, setChoiceIndex] = useState(0);
  const [editPreferenceModal, setEditPreferenceModal] = useState(false);
  const [itemsArrayBool, setItemsArrayBool] = useState(new Array(authContext.items.length).fill(false))
  const [errorMessage, setErrorMessage] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [newPreferences, setNewPreferences] = useState([]);

  const [preferencesBool, setPreferencesBool] = useState(new Array(authContext.restaurantPreferences).fill(false))
  const auth = Firebase.auth();


  const uploadPreferences = async()=>{
      const preferencesTemp = preferences.map((x)=>x);
      console.log("BEGIN", preferencesTemp);
      preferencesBool.map(async (pref, j)=>{
        if (pref===true){
            // await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('items').doc(route.params.item.name).collection('add-ons').doc(authContext.restaurantPreferences[j]["name"]).set({
            //     name: authContext.restaurantPreferences[j]["name"],
            //     number: authContext.restaurantPreferences[j]["number"],
            //     required: authContext.restaurantPreferences[j]["required"],
            //     repeats: authContext.restaurantPreferences[j]["repeats"],
            //     choices: authContext.restaurantPreferences[j]["choices"],
            //     prices: authContext.restaurantPreferences[j]["prices"]
            // })
            preferencesTemp.push(authContext.restaurantPreferences[j]);

        }
    })
    setPreferences(preferencesTemp);
    return preferencesTemp;
  }

  return (
    <View style={{height: Dimensions.get("screen").height, width: '100%', marginTop: 'auto', backgroundColor: 'white', paddingVertical: 50}}>
        <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginHorizontal: 10, paddingBottom: 10, marginTop: 3}}>Add Preference</Text>
            <TouchableOpacity disabled={submitLoading} onPress={()=>navigation.pop(1)} style={{position: 'absolute', right: 0}}>
            <MaterialCommunityIcons name="close" size={25}/>
            </TouchableOpacity>

        </View>

        <ScrollView style={{ width: '90%', height: Dimensions.get("screen").height, alignSelf: 'center'}} showsVerticalScrollIndicator={false}>

            {authContext.restaurantPreferences.map((preference, i)=>{
                    return(
                        <View key={i} style={{width: '90%', alignSelf: 'center', marginVertical: 5, marginBottom: 20, flexDirection: 'row'}}>
                            <View style={{width: '20%', alignItems: 'center', marginTop: 25}}>
                                <TouchableOpacity onPress={()=>{
                                    const boolTemp = preferencesBool.map((x)=>x);
                                    boolTemp[i] = !boolTemp[i];
                                    setPreferencesBool(boolTemp);
                                }}>
                                    <View style={{width: 18, height: 18, borderWidth: 1, borderColor: 'black'}}>
                                        {preferencesBool[i] === true ? <View style={{width: 10, height: 10, backgroundColor: 'black', alignSelf: 'center', marginTop: 3}}></View> : null}
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={{width: '80%'}}>
                            <View style={{flexDirection: 'row', width: '100%', alignSelf: 'center', marginVertical: 5}}>
                            <Text style={{width: '80%', fontWeight: 'bold'}}>{preference["name"]}</Text>
                            </View>

                            <View style={{width: '100%', flexDirection: 'row', alignSelf: 'center',  marginVertical: 5}}>
                            {preference["required"] === true ? <Text style={{width: '80%'}}>Required choice: True</Text> : <Text style={{width: '80%'}}>Required choice: False</Text> }
                            </View>

                            <View style={{width: '100%', flexDirection: 'row', alignSelf: 'center',  marginVertical: 5}}>
                            <Text style={{width: '80%'}}>Number of user selections: {preference["number"]}</Text>

                            </View>

                            

                            <Text style={{marginVertical: 5, fontWeight: 'bold'}}>Choices</Text>

                            {preference["choices"].map((choice, j)=>{
                                return(<View key={j} style={{flexDirection: 'row', marginVertical: 5, width: '100%'}}>
                                    <View style={{width: '80%', flexDirection: 'row'}}>
                                    <Text style={{}}>{j+1}. {choice}</Text>
                                    {preference["prices"][j] === 0 ? null : <Text style = {{marginHorizontal: 5, color: 'gray'}}> + ${preference["prices"][j]}</Text>}
                                    </View>
                                    </View>)
                            })}
                            </View>

                        </View>

                        
                    )
                })}

            <TouchableOpacity disabled={submitLoading} style={{alignSelf: 'center', marginTop: 50, margin: 30}} 
                onPress={async ()=>{
                    setSubmitLoading(true);
                    const newPreferencesTemp = [];
                    const p = await uploadPreferences()
                    await new Promise(resolve => setTimeout(resolve, 100));

                    setSubmitLoading(false);
                    navigation.push("Item Modal", {item: route.params.item, preferences: p, uriText: route.params.uriText});
                    

                    
                    
                }}
            
            
            >
                        <Text>Add preferences</Text>
                </TouchableOpacity>

        </ScrollView>

    </View>


    
  );
}
