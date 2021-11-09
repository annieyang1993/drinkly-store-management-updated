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

export default function AddPreference({navigation}) {
  const authContext = useContext(AuthContext)
  const [preferences, setPreferences] = useState({});
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
  const auth = Firebase.auth();


  return (
    <View style={{height: Dimensions.get("screen").height, width: '100%', marginTop: 'auto', backgroundColor: 'white', paddingVertical: 50}}>
        <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            <TouchableOpacity disabled={submitLoading} onPress={()=>navigation.pop(1)}>
            <MaterialCommunityIcons name="arrow-left" size={25}/>
            </TouchableOpacity>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginHorizontal: 10, paddingBottom: 10, marginTop: 3}}>Add Preference</Text>
        </View>

        <ScrollView style={{ width: '90%', height: Dimensions.get("screen").height, alignSelf: 'center'}} showsVerticalScrollIndicator={false}>

            <View style={{flexDirection: 'row'}}>
                <Text style={{width: '30%', paddingVertical: 5, fontWeight: 'bold'}}>Name:</Text>

                <InputField
                    inputStyle={{
                    fontSize: 14,
                    }}
                    containerStyle={{
                    width: '70%',
                    zIndex: 600,
                    paddingBottom: 2,
                    backgroundColor: '#e8eded',
                    borderWidth: 1,
                    borderColor: 'lightgray',
                    alignSelf: 'center',
                    paddingTop: -2
                    }}
                    placeholder={"Name"}
                    autoFocus={true}
                    autoCapitalize='sentences'
                    keyboardType= {'default'}
                    textContentType='telephoneNumber'
                    value={name}
                    autoFocus={false}
                    maxLength={50}
                    numberOfLines={1}
                    onChangeText={text => {
                        setName(text);
                    }}
                    secureTextEntry={false}
                /> 

            </View>

            <Text style={{marginTop: 5, fontSize: 13, color: 'gray', fontStyle: 'italic'}}>* Please make sure this is not an existing preference name unless you would like to override the preference.</Text>

             <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text style={{width: '30%', paddingVertical: 5, fontWeight: 'bold'}}>Description:</Text>

                <InputField
                    inputStyle={{
                    fontSize: 14,
                    }}
                    containerStyle={{
                    width: '70%',
                    zIndex: 600,
                    paddingBottom: 2,
                    paddingTop: -2,
                    marginVertical: 2,
                    paddingHorizontal: 5,
                    backgroundColor: '#e8eded',
                    borderWidth: 1,
                    borderColor: 'lightgray',
                    alignSelf: 'center',
                    marginTop: 5
                    }}
                    placeholder={"Description (max 300 chars)"}
                    autoFocus={false}
                    autoCapitalize='sentences'
                    keyboardType= {'default'}
                    textContentType='telephoneNumber'
                    value={description}
                    autoFocus={false}
                    maxLength={300}
                    numberOfLines={1}
                    onChangeText={text => {
                        setDescription(text);
                    }}
                    secureTextEntry={false}
                /> 

            </View>

            <Text style={{marginTop: 5, fontSize: 13, color: 'gray', fontStyle: 'italic'}}>* Short description (not required)</Text>


             <View style={{flexDirection: 'row'}}>
                 <Text style={{width: '30%', marginTop: 20, fontWeight: 'bold'}}>Required choice: </Text>
                {required ? 
                            <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 20}}> 
                            <TouchableOpacity style={{width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: 'black', backgroundColor: 'white'}}>
                                <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: 'black', alignSelf: 'center', marginTop: 2}}></View>
                            </TouchableOpacity>
                            <Text style={{marginLeft: 5}}>True</Text>

                            <TouchableOpacity onPress={()=>{setRequired(false)}} style={{width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: 'black', backgroundColor: 'white', marginLeft: 10}}>
                            </TouchableOpacity>
                            <Text style={{marginLeft: 5}}>False</Text>
                            </View> :

                            <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 20}}> 
                            <TouchableOpacity onPress={()=>{setRequired(true); setNumber(1); setRepeat(false)}}  style={{width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: 'black', backgroundColor: 'white'}}>
                            </TouchableOpacity>
                            <Text style={{marginLeft: 5}}>True</Text>

                            <TouchableOpacity style={{width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: 'black', backgroundColor: 'white', marginLeft: 10}}>
                                <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: 'black', alignSelf: 'center', marginTop: 2}}></View>
                            </TouchableOpacity>
                            <Text style={{marginLeft: 5}}>False</Text>
                            </View> }
            </View>

            <Text style={{marginTop: 5, fontSize: 13, color: 'gray', fontStyle: 'italic'}}>* Is this choice required for your customer to order the item? (Note: if true, number of selections is set to 1)</Text>

            <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text style={{width: '30%', paddingVertical: 5, fontWeight: 'bold'}}>Number of selections:</Text>

                {required ? <Text style={{width: '10%', padding: 3, paddingTop: 4, paddingHorizontal: 5, height: 26, backgroundColor: '#e8eded', borderWidth: 1, borderRadius: 5, borderColor: 'lightgray', marginTop: 10, color: 'gray'}}>{number}</Text> :
                <InputField
                    inputStyle={{
                    fontSize: 14,
                    }}
                    containerStyle={{
                    width: '10%',
                    zIndex: 600,
                    paddingBottom: 2,
                    paddingTop: -2,
                    marginVertical: 2,
                    paddingHorizontal: 5,
                    backgroundColor: '#e8eded',
                    borderWidth: 1,
                    borderColor: 'lightgray',
                    alignSelf: 'center',
                    marginTop: 5
                    }}
                    placeholder={""}
                    autoCapitalize='sentences'
                    keyboardType= {'number-pad'}
                    textContentType='telephoneNumber'
                    value={String(number)}
                    maxLength={2}
                    numberOfLines={1}
                    onChangeText={text => {
                        setNumber(text);
                    }}
                    secureTextEntry={false}
                /> }

            </View>
            <Text style={{marginTop: 5, fontSize: 13, color: 'gray', fontStyle: 'italic'}}>* How many selections can the user make?</Text>

            <View style={{flexDirection: 'row'}}>
                 <Text style={{width: '30%', marginTop: 20, fontWeight: 'bold'}}>Repeats allowed: </Text>
                {repeat ? 
                            <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 20}}> 
                            <TouchableOpacity disabled={required} style={{width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: 'black', backgroundColor: 'white'}}>
                                <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: 'black', alignSelf: 'center', marginTop: 2}}></View>
                            </TouchableOpacity>
                            <Text style={{marginLeft: 5}}>True</Text>

                            <TouchableOpacity disabled={required} onPress={()=>{setRepeat(false)}} style={{width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: 'black', backgroundColor: 'white', marginLeft: 10}}>
                            </TouchableOpacity>
                            <Text style={{marginLeft: 5}}>False</Text>
                            </View> :

                            <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 20}}> 
                            <TouchableOpacity disabled={required} onPress={()=>{setRepeat(true)}}  style={{width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: 'black', backgroundColor: 'white'}}>
                            </TouchableOpacity>
                            <Text style={{marginLeft: 5}}>True</Text>

                            <TouchableOpacity disabled={required} style={{width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: 'black', backgroundColor: 'white', marginLeft: 10}}>
                                <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: 'black', alignSelf: 'center', marginTop: 2}}></View>
                            </TouchableOpacity>
                            <Text style={{marginLeft: 5}}>False</Text>
                            </View> }
            </View>

            <Text style={{marginTop: 5, fontSize: 13, color: 'gray', fontStyle: 'italic'}}>* Can the user repeat a selection (i.e. two servings of milk)? Only allowed for non-required choices.</Text>

             <View style={{flexDirection: 'row'}}>
                 <Text style={{width: '30%', marginTop: 20, fontWeight: 'bold'}}>Choices: </Text>
            </View>

            {preferenceChoices.map((choice, j)=>{
                return(<View key={j} style={{flexDirection: 'row', marginVertical: 5, width: '100%'}}>
                    <View style={{width: '80%', flexDirection: 'row'}}>
                    <Text style={{}}>{j+1}. {choice}</Text>
                    {preferencePrices[j] === 0 ? null : <Text style = {{marginHorizontal: 5, color: 'gray'}}> + ${preferencePrices[j]}</Text>}
                    </View>
                    <TouchableOpacity style={{alignItems: 'flex-end', width: '20%'}} onPress={async ()=>{setChoice(choice); setPrice(preferencePrices[j]); setChoiceIndex(j); setEditPreferenceModal(true)}}>
                        <Text style={{alignSelf: 'flex-end', textAlign: 'right', color: 'gray'}}>Edit</Text>
                    </TouchableOpacity>
                    </View>)
                })}

            <TouchableOpacity onPress={()=>setAddPreferenceModal(true)}>
            <Text style={{marginTop: 10, color: 'gray'}}>+ Add choice</Text>
            </TouchableOpacity>

            <View style={{flexDirection: 'row'}}>
                 <Text style={{width: '30%', marginTop: 20, fontWeight: 'bold'}}>Items: </Text>
            </View>

            <Text style={{marginTop: 5, fontSize: 13, color: 'gray', fontStyle: 'italic', marginBottom: 10}}>* Select the items you want to add this selection to.</Text>

            {authContext.items.map((item, index)=>{
                return(<TouchableOpacity key={index} style={{flexDirection: 'row', marginVertical: 10, marginHorizontal: 20}} onPress={()=>{
                    const itemsArrayTemp = itemsArrayBool.map((x)=>x);
                    itemsArrayTemp[index] = !itemsArrayTemp[index];
                    setItemsArrayBool(itemsArrayTemp);

                }}>
                        <View style={{width: 18, height: 18, borderWidth: 1, borderColor: 'black'}}>
                            {itemsArrayBool[index] === true ? <View style={{width: 10, height: 10, backgroundColor: 'black', alignSelf: 'center', marginTop: 3}}></View> : null}
                        </View>
                        <Text style={{marginLeft: 5}}>{item["name"]}</Text>
                    </TouchableOpacity>)
            })}
            <TouchableOpacity disabled={submitLoading} style={{alignSelf: 'center'}} onPress={async ()=>{
                if (preferenceChoices.length===0){
                    setErrorMessage('Please add at least one choice.')
                } else if (name.length === 0){
                    setErrorMessage('Please add a preference name.')
                }else{
                    setErrorMessage('');
                    setSubmitLoading(true);
                    
                    await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('add-ons').doc(name).set({
                                name: name,
                                description: description,
                                required: required,
                                number: Number(number),
                                repeats: repeat,
                                choices: preferenceChoices,
                                prices: preferencePrices
                            })
                    itemsArrayBool.map(async (itemBool, idx)=>{
                        if (itemBool === true){
                            const item = authContext.items["name"];
                            await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('items').doc((authContext.items)[idx]["name"]).collection('add-ons').doc(name).set({
                                name: name,
                                description: description,
                                required: required,
                                number: Number(number),
                                repeats: repeat,
                                choices: preferenceChoices,
                                prices: preferencePrices
                            })
                            
                        }
                    })
                    await new Promise(resolve => setTimeout(resolve, 300));
                    setSubmitLoading(false);
                    navigation.pop(1);
                }

            }}>
                <Text style={{marginTop: 20, alignSelf: 'center'}}>Submit Preference</Text>
            </TouchableOpacity>

            {submitLoading ? <ActivityIndicator style={{alignSelf: 'center', marginTop: 10}} size='large'/> : null}

            <Text style={{alignSelf: 'center', marginTop: 10, color: 'red'}}>{errorMessage}</Text>

            <View style={{height: 100}}></View>

            

        </ScrollView>


                {/* EDIT CHOICE AND PRICE MODAL */}
        <Modal visible={editPreferenceModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
            <View style={{height: 150, width: '90%', backgroundColor: 'white', position: 'absolute', top: '25%', left: '5%', borderRadius: 15, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
                <View style={{backgroundColor: 'white',
                    borderRadius: 10,
                    position: 'absolute',
                    zIndex: 50,
                    marginTop: 5,
                    width: '100%',
                    alignSelf: 'center'
                    }}> 

                    <Text style={{alignSelf: 'center', marginTop: 20, fontWeight: 'bold'}}>Edit choice</Text>

                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <View style={{width: '40%', margin: 5}}>

                    <Text style={{alignSelf: 'center'}}>Name</Text>
                    <InputField
                        inputStyle={{
                        fontSize: 14,
                        }}
                        containerStyle={{
                        width: '100%',
                        zIndex: 600,
                        paddingBottom: 2,
                        paddingTop: -2,
                        marginVertical: 2,
                        paddingHorizontal: 5,
                        backgroundColor: '#e8eded',
                        borderWidth: 1,
                        borderColor: 'lightgray',
                        alignSelf: 'center',
                        marginTop: 5
                        }}
                        placeholder={"Choice"}
                        autoFocus={false}
                        autoCapitalize='sentences'
                        keyboardType= {'default'}
                        textContentType='telephoneNumber'
                        value={String(choice)}
                        autoFocus={false}
                        maxLength={50}
                        numberOfLines={1}
                        onChangeText={text => {
                            setChoice(text);
                        }}
                        secureTextEntry={false}
                    /> 

                    </View>

                    <View style={{width: '40%', margin: 5}}>
                        <Text style={{alignSelf: 'center'}}>Price</Text>
                    <InputField
                        inputStyle={{
                        fontSize: 14,
                        }}
                        containerStyle={{
                        width: '100%',
                        zIndex: 600,
                        paddingBottom: 2,
                        paddingTop: -2,
                        marginVertical: 2,
                        paddingHorizontal: 5,
                        backgroundColor: '#e8eded',
                        borderWidth: 1,
                        borderColor: 'lightgray',
                        alignSelf: 'center',
                        marginTop: 5
                        }}
                        placeholder={"Price"}
                        autoFocus={false}
                        autoCapitalize='sentences'
                        keyboardType= {'default'}
                        textContentType='telephoneNumber'
                        value={String(price)}
                        autoFocus={false}
                        maxLength={50}
                        numberOfLines={1}
                        onChangeText={text => {
                            setPrice(text);
                        }}
                        secureTextEntry={false}
                    /> 
                    </View>

                    </View>

                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 10, margin: 30}} onPress={()=>{
                            const preferencesTemp = preferenceChoices.map((x)=>x);
                            const preferencesPriceTemp = preferencePrices.map((x)=>x);
                            if (preferencesTemp.length>1){
                                preferencesTemp.splice(choiceIndex, 1)
                                preferencesPriceTemp.splice(choiceIndex, 1)
                                setPreferenceChoices(preferencesTemp);
                                setPreferencePrices(preferencesPriceTemp);
                                setChoice('');
                                setPrice(0);
                                setEditPreferenceModal(false);
                            }
                                                 
                    }}>
                        <Text>Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 10, margin: 30}} onPress={()=>{
                        if (isNaN(price)===false && choice!==''){
                            const preferencesTemp = preferenceChoices.map((x)=>x);
                            const preferencesPriceTemp = preferencePrices.map((x)=>x);
                            preferencesTemp[choiceIndex] = choice;
                            preferencesPriceTemp[choiceIndex] = Number(price);
                            setPreferenceChoices(preferencesTemp);
                            setPreferencePrices(preferencesPriceTemp);
                            setChoice('');
                            setPrice(0);
                            setEditPreferenceModal(false);
                        }
                        
                    }}>
                        <Text>Submit</Text>
                    </TouchableOpacity>

                    </View>

                     

                
                <TouchableOpacity
                    style={{backgroundColor: 'white',
                    borderRadius: 10,
                    position: 'absolute',
                    margin: 10,
                    marginHorizontal: 5,
                    zIndex: 50,
                    marginTop: 5
                    }}
                    onPress={() => {
                        setEditPreferenceModal(false);
                    }}>
                    <Text style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontSize: 15, padding: 5}}><MaterialCommunityIcons name="close" size={20} color='gray'/></Text>
                </TouchableOpacity>
            </View>
            </View>
            </Modal>


                    {/* ADD CHOICE AND PRICE MODAL */}
        <Modal visible={addPreferenceModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
            <View style={{height: 150, width: '90%', backgroundColor: 'white', position: 'absolute', top: '25%', left: '5%', borderRadius: 15, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
                <View style={{backgroundColor: 'white',
                    borderRadius: 10,
                    position: 'absolute',
                    zIndex: 50,
                    marginTop: 5,
                    width: '100%',
                    alignSelf: 'center'
                    }}> 

                    <Text style={{alignSelf: 'center', marginTop: 20, fontWeight: 'bold'}}>Add choice</Text>

                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <View style={{width: '40%', margin: 5}}>

                    <Text style={{alignSelf: 'center'}}>Name</Text>
                    <InputField
                        inputStyle={{
                        fontSize: 14,
                        }}
                        containerStyle={{
                        width: '100%',
                        zIndex: 600,
                        paddingBottom: 2,
                        paddingTop: -2,
                        marginVertical: 2,
                        paddingHorizontal: 5,
                        backgroundColor: '#e8eded',
                        borderWidth: 1,
                        borderColor: 'lightgray',
                        alignSelf: 'center',
                        marginTop: 5
                        }}
                        placeholder={"Choice"}
                        autoFocus={false}
                        autoCapitalize='sentences'
                        keyboardType= {'default'}
                        textContentType='telephoneNumber'
                        value={String(choice)}
                        autoFocus={false}
                        maxLength={50}
                        numberOfLines={1}
                        onChangeText={text => {
                            setChoice(text);
                        }}
                        secureTextEntry={false}
                    /> 

                    </View>

                    <View style={{width: '40%', margin: 5}}>
                        <Text style={{alignSelf: 'center'}}>Price</Text>
                    <InputField
                        inputStyle={{
                        fontSize: 14,
                        }}
                        containerStyle={{
                        width: '100%',
                        zIndex: 600,
                        paddingBottom: 2,
                        paddingTop: -2,
                        marginVertical: 2,
                        paddingHorizontal: 5,
                        backgroundColor: '#e8eded',
                        borderWidth: 1,
                        borderColor: 'lightgray',
                        alignSelf: 'center',
                        marginTop: 5
                        }}
                        placeholder={"Price"}
                        autoFocus={false}
                        autoCapitalize='sentences'
                        keyboardType= {'default'}
                        textContentType='telephoneNumber'
                        value={String(price)}
                        autoFocus={false}
                        maxLength={50}
                        numberOfLines={1}
                        onChangeText={text => {
                            setPrice(text);
                        }}
                        secureTextEntry={false}
                    /> 
                    </View>

                    </View>

                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 10, margin: 30}} onPress={()=>{
                        if (isNaN(price)===false && choice!==''){
                            const preferencesTemp = preferenceChoices.map((x)=>x);
                            const pricesTemp = preferencePrices.map((x)=>x);
                            preferencesTemp.push(choice);
                            pricesTemp.push(Number(price));
                            
                            setPreferenceChoices(preferencesTemp);
                            setPreferencePrices(pricesTemp);
                            setChoice('');
                            setPrice(0);
                            setAddPreferenceModal(false)
                        }
                        
                    }}>
                        <Text>Add</Text>
                    </TouchableOpacity>

                    </View>

                     

                
                <TouchableOpacity
                    style={{backgroundColor: 'white',
                    borderRadius: 10,
                    position: 'absolute',
                    margin: 10,
                    marginHorizontal: 5,
                    zIndex: 50,
                    marginTop: 5
                    }}
                    onPress={() => {
                        setAddPreferenceModal(false)
                    }}>
                    <Text style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontSize: 15, padding: 5}}><MaterialCommunityIcons name="close" size={20} color='gray'/></Text>
                </TouchableOpacity>
            </View>
            </View>
            </Modal>
    </View>


    
  );
}
