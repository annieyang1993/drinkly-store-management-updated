import React, {useContext, useState, useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import {useNavigation, StackActions} from '@react-navigation/native'
import InputField from '../components/InputField'
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import {ActivityIndicator, Modal, ScrollView, Dimensions, TouchableOpacity, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { TouchableHighlight, Button, TextInput, Screen, Image, Platform} from 'react-native'
import {Firebase, db} from '../config/firebase';
import AuthContext from '../context/Context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {ImagePicker, launchImageLibraryAsync} from 'expo-image-picker'
import SelectDropdown from 'react-native-select-dropdown';
import FastImage from 'react-native-fast-image'
import * as FileSystem from 'expo-file-system'
import CachedImage from 'react-native-expo-cached-image'

const Stack = createStackNavigator();

export default function ItemModal({route}) {
  const authContext = useContext(AuthContext)
  const [photoLoading, setPhotoLoading] = useState(false);
  const [description, setDescription] = useState(route.params.item.description);
  const [name, setName] = useState(route.params.item.name);
  const [section, setSection] = useState(route.params.item.section);
  const [image, setImage] = useState(route.params.item.img)
  const [uploadImageModal, setUploadImageModal] = useState(false)
  const [uriText, setUriText] = useState(route.params.uriText)
  const [loadingState, setLoadingState] = useState(0);
  const [priceDollar, setPriceDollar] = useState(String(route.params.item.price).split('.')[0]);
  const [priceCents, setPriceCents] = useState(String(route.params.item.price).split('.')[1]);
  const [preferences, setPreferences] = useState(route.params.preferences);
  const [errorMessage, setErrorMessage] = useState('');
  const [editPreferenceModal, setEditPreferenceModal] = useState(false);
  const [deleteItemModal, setDeleteItemModal] = useState(false);

  //Modals
  const [nameModal, setNameModal] = useState(false);
  const [numChoicesModal, setNumChoicesModal] = useState(false);
  const [requiredModal, setRequiredModal] = useState(false);
  const [repeatModal, setRepeatModal] = useState(false);
  const [editChoiceModal, setEditChoiceModal] = useState(false);
  const [addChoiceModal, setAddChoiceModal] = useState(false);
  const [preferenceIndex, setPreferenceIndex] = useState(0);
  const [editPreference, setEditPreference] = useState(route.params.preferences[Object.keys(route.params.preferences)[0]]);

  const [prefName, setPrefName] = useState('');
  const [prefNum, setPrefNum] = useState(1);
  const [prefRequired, setPrefRequired] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [choice, setChoice] = useState('');
  const [prefPrice, setPrefPrice] = useState(0);
  const [choiceIndex, setChoiceIndex] = useState(0);

  const [itemNameModal, setItemNameModal] = useState(false);
  const [itemDescriptionModal, setItemDescriptionModal] = useState(false);
  const [itemSectionModal, setItemSectionModal] = useState(false);
  const [modalInput, setModalInput] = useState('');
  const [itemPriceModal, setItemPriceModal] = useState(false);

  const [sections, setSections] = useState(authContext.storeData.sections.concat(['+ Add section']));
  const [addSection, setAddSection] = useState(false);
  const [submittingChanges, setSubmittingChanges] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(async ()=>{
    //   const preferencesTemp = preferences.map((x)=>x);
    //   route.params.existingPreferences.map((preference, i)=>{
    //       preferencesTemp.push(preferences);
    //   })
    //   setPreferences(preferencesTemp);
        //var ref = await Firebase.storage().ref().child(`${authContext.storeData.restaurant_id}/`+"Temp").delete();
        //console.log("THIS IS REF", ref);
   }, [])


  const navigation = useNavigation();

   const selectImage = async (fileName) => {

        let result = await launchImageLibraryAsync()
        //console.log(result)
        var name = route.params.item.name;
        await setImageLoading(true);
        if (!result.cancelled){
           await setLoadingState(1);
           await setUriText(result.uri)
           uploadImage(result.uri, fileName)
           .then(async (data)=>{
               
               data.ref.getDownloadURL().then(url=>{
                   setImage('');
                   setImage(url);
                   setLoadingState(2);
               });
               //var picturesTemp = authContext.storeData.pictures;
               //picturesTemp[i] = await ref.getDownloadURL();
               //var imageURL = await ref.getDownloadURL();
            //    await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).set({
            //        pictures: picturesTemp
            //    }, {merge: true})
           })
           .catch((error)=>{
               console.log(error);
           });
            //uploadImage(result.uri)
        }
        await setImageLoading(false);
    };

    const uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const ref = await Firebase.storage().ref().child(`${authContext.storeData.restaurant_id}/`+imageName)


        //const storage = await Firebase.ref(Firebase.storage(), `${authContext.storeData.restaurant_id}/`+imageName)
        return ref.put(blob);
    }

    const getItems = async () => {
        const itemsTemp = [];
        authContext.items.map((item, i)=>{
            if (item["name"]!==route.params.item["name"]){
                itemsTemp.push(item);
            }
        })
        authContext.setItems(itemsTemp);
    }



  return (
    <View style={{height: Dimensions.get("screen").height, width: '100%', marginTop: 'auto', backgroundColor: 'white', paddingVertical: 50}}>
        <View style={{width: '100%', alignSelf: 'center'}}>
            <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            <TouchableOpacity disabled={submittingChanges} onPress={()=>navigation.navigate("Items")}>
            <MaterialCommunityIcons name="arrow-left" size={25}/>
            </TouchableOpacity>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginHorizontal: 10, paddingBottom: 10, marginTop: 3}}>{route.params.item.name}</Text>
            </View>
            <ScrollView style={{height: '100%'}}>
                <Text style={{marginTop: 5, fontSize: 13, color: 'gray', fontStyle: 'italic', width: '90%', alignSelf: 'center'}}>Please submit any changes at the bottom of the page.</Text>
                <View style={{flexDirection: 'row', width: '95%', alignSelf: 'center', marginBottom: 10, marginTop: 15}}>
                <Text style={{fontSize: 17, fontWeight: 'bold', width: '80%'}} numberOfLines={1}>Name</Text>
                </View>

                <Text style={{width: '95%', alignSelf: 'center', backgroundColor: '#f3f7f7', borderWidth: 1, borderColor: 'lightgray', padding: 5, borderRadius: 3}}>{name}</Text>


                
                <View style={{flexDirection: 'row', width: '95%', alignSelf: 'center', marginBottom: 10, marginTop: 15}}>
                <Text style={{fontSize: 17, fontWeight: 'bold'}}>Image</Text>
                <TouchableOpacity style={{position: 'absolute', right: 0}} onPress={()=>{setUriText('Please select an image from your photos'); setUploadImageModal(true)}}>
                    <Text style={{color: 'gray', marginTop: 3}}>Upload new image</Text>
                </TouchableOpacity>
                </View>

                <CachedImage style={{width: '95%', height: 300, alignSelf: 'center', resizeMode: "cover", borderRadius: 5, backgroundColor: '#f3f7f7', borderWidth: 1, borderColor: 'lightgray'}} source = {{uri: image}} onLoadStart={() => setImageLoading(true)} onLoadEnd={() => {setImageLoading(false)}}/>
                {imageLoading ? <ActivityIndicator size='large' style={{marginTop: -150, marginBottom: 150}}/> : null}

                <View style={{flexDirection: 'row', width: '95%', alignSelf: 'center', marginBottom: 10, marginTop: 15}}>
                <Text style={{fontSize: 17, fontWeight: 'bold', width: '60%'}} numberOfLines={1}>Description</Text>
                <TouchableOpacity style={{position: 'absolute', right: 0, width: '40%', alignItems: 'flex-end'}} onPress={()=>{setModalInput(description); setItemDescriptionModal(true)}}>
                    <Text style={{color: 'gray', marginTop: 3}}>Add/edit description</Text>
                </TouchableOpacity>
                </View>

                <Text style={{width: '95%', alignSelf: 'center', backgroundColor: '#f3f7f7', borderWidth: 1, borderColor: 'lightgray', padding: 5, borderRadius: 3}}>{description}</Text>

                <View style={{flexDirection: 'row', width: '95%', alignSelf: 'center', marginBottom: 10, marginTop: 15}}>
                <Text style={{fontSize: 17, fontWeight: 'bold', width: '60%'}} numberOfLines={1}>Price</Text>
                <TouchableOpacity style={{position: 'absolute', right: 0, width: '40%', alignItems: 'flex-end'}} onPress={()=>{setModalInput([priceDollar, priceCents].join('.')); setItemPriceModal(true)}}>
                    <Text style={{color: 'gray', marginTop: 3}}>Edit price</Text>
                </TouchableOpacity>
                </View>

                <Text style={{width: '95%', alignSelf: 'center', backgroundColor: '#f3f7f7', borderWidth: 1, borderColor: 'lightgray', padding: 5, borderRadius: 3}}>${priceDollar}.{priceCents}</Text>

                <View style={{flexDirection: 'row', width: '95%', alignSelf: 'center', marginBottom: 10, marginTop: 15}}>
                <Text style={{fontSize: 17, fontWeight: 'bold', width: '60%'}} numberOfLines={1}>Section</Text>
                <TouchableOpacity style={{position: 'absolute', right: 0, width: '40%', alignItems: 'flex-end'}} onPress={()=>{setModalInput(''); setItemSectionModal(true)}}>
                    <Text style={{color: 'gray', marginTop: 3}}>Edit section</Text>
                </TouchableOpacity>
                </View>

                <Text style={{width: '95%', alignSelf: 'center', backgroundColor: '#f3f7f7', borderWidth: 1, borderColor: 'lightgray', padding: 5, borderRadius: 3}}>{section}</Text>

                <View style={{flexDirection: 'row', width: '95%', alignSelf: 'center', marginBottom: 10, marginTop: 15}}>
                <Text style={{fontSize: 17, fontWeight: 'bold', width: '60%'}} numberOfLines={1}>Preferences</Text>

                <TouchableOpacity style={{position: 'absolute', right: 0}} onPress={()=>navigation.push("Add Existing Preference", {item: {
                    name: name,
                    description: description,
                    img: image,
                    price: [Number(priceDollar), Number(priceCents)].join('.'),
                    section: section}, preferences: preferences, uriText: uriText})}>
                    <Text style={{color: 'gray'}}>+ Add preference</Text>
                </TouchableOpacity>
                </View>

                

                {preferences.map((preference, i)=>{
                    return(
                        <View key={i} style={{width: '95%', alignSelf: 'center', marginVertical: 5, marginBottom: 20, borderRadius: 5, borderWidth: 1, borderColor: 'lightgray', padding: 5, backgroundColor: 'white', shadowColor: 'gray', shadowOffset: {width: 3, height: 5}, shadowRadius: 5, shadowOpacity: 0.3, }}>
                            <View style={{flexDirection: 'row', width: '100%', alignSelf: 'center', marginVertical: 5}}>
                            <Text style={{width: '80%', fontWeight: 'bold', fontSize: 16}}>{preference["name"]}</Text>
                            <TouchableOpacity style={{alignItems: 'flex-end', width: '20%'}} onPress={async ()=>{setEditPreference(preference); setPrefName(preference["name"]); setPreferenceIndex(i); setNameModal(true)}}>
                                <Text style={{alignSelf: 'flex-end', textAlign: 'right', marginRight: 5, color: 'gray'}}>Edit</Text>
                            </TouchableOpacity>
                            </View>

                            <View style={{width: '100%', flexDirection: 'row', alignSelf: 'center',  marginVertical: 5}}>
                            {preference["required"] === true ? <Text style={{width: '80%'}}>Required choice: True</Text> : <Text style={{width: '80%'}}>Required choice: False</Text> }
                                <TouchableOpacity style={{alignItems: 'flex-end', width: '20%'}} onPress={async ()=>{setEditPreference(preference); setPreferenceIndex(i); setRequiredModal(true); setPrefRequired(preference["required"])}}>
                                    <Text style={{alignSelf: 'flex-end', textAlign: 'right', marginRight: 5, color: 'gray'}}>Edit</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{width: '100%', flexDirection: 'row', alignSelf: 'center',  marginVertical: 5}}>
                            <Text style={{width: '80%'}}>Number of user selections: {preference["number"]}</Text>

                            {preference["required"]=== true ? <Text style={{alignSelf: 'flex-end', textAlign: 'right', color: 'lightgray', width: '19%', marginRight: 5}}>Edit</Text> :
                                <TouchableOpacity style={{alignItems: 'flex-end', width: '20%'}} onPress={async ()=>{setEditPreference(preference); setPreferenceIndex(i); setPrefNum(preference["number"]); setNumChoicesModal(true)}}>
                                    <Text style={{alignSelf: 'flex-end', textAlign: 'right', marginRight: 5, color: 'gray'}}>Edit</Text>
                                </TouchableOpacity>}
                            </View>

                            

                            <Text style={{marginVertical: 5, fontWeight: 'bold', fontSize: 16}}>Choices</Text>

                            {preference["choices"].map((choice, j)=>{
                                return(<View key={j} style={{flexDirection: 'row', marginVertical: 5, width: '100%'}}>
                                    <View style={{width: '80%', flexDirection: 'row'}}>
                                    <Text style={{}}>{j+1}. {choice}</Text>
                                    {preference["prices"][j] === 0 ? null : <Text style = {{marginHorizontal: 5, color: 'gray'}}> + ${preference["prices"][j]}</Text>}
                                    </View>
                                    <TouchableOpacity style={{alignItems: 'flex-end', width: '20%'}} onPress={async ()=>{setEditPreference(preference); setPreferenceIndex(i); setChoice(choice); setPrefPrice(preference["prices"][j]); setChoiceIndex(j); setEditChoiceModal(true)}}>
                                        <Text style={{alignSelf: 'flex-end', textAlign: 'right', marginRight: 5, color: 'gray'}}>Edit</Text>
                                    </TouchableOpacity>
                                    </View>)
                            })}

                            <TouchableOpacity onPress={async ()=>{setEditPreference(preference); setChoice(''); setPrefPrice(0); setPreferenceIndex(i); setAddChoiceModal(true)}}>
                            <Text style={{margin: 5, color: 'gray'}}>+ Add choice</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={()=>{setDeleteModal(true); setPreferenceIndex(i)}}>
                                <Text style={{margin: 5, marginTop: 10, color: 'gray'}}>Delete preference</Text>
                            </TouchableOpacity>
                        </View>

                        
                    )
                })}

                <TouchableOpacity disabled={submittingChanges} style={{marginTop: 30, margin: 30, marginBottom: 10, backgroundColor: '#44bec6', padding: 5, width: '35%', borderRadius: 5, alignSelf: 'center', height: 30}} onPress={async ()=>{
                    await setSubmittingChanges(true);
                    if (uriText === 'Please select an image from your photos'){
                        console.log("UPLOADING WITH URI")
                        await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('items').doc(route.params.item.name).set({
                            price: [priceDollar,priceCents].join('.'),
                            section: section,
                            description: description
                        }, {merge: true})

                        const itemsTemp = authContext.items.map((x)=> {
                            if (x["name"]===route.params.item.name){
                                return ({
                                    name: route.params.item.name,
                                    price: [priceDollar,priceCents].join('.'),
                                    section: section,
                                    description: description,
                                    img: image
                                })
                            } else{
                                return x
                            };
                         });

                         await authContext.setItems(itemsTemp)

                        
                    } else{
                        console.log("UPLOADING WITHOUT URI")
                        console.log({
                            price: [priceDollar,priceCents].join('.'),
                            section: section,
                            description: description,
                            img: image
                        })
                        uploadImage(uriText, route.params.item.name)
                       .then(async (data)=>{
                            data.ref.getDownloadURL().then(async (url)=>{
                            setImage('');
                            setImage(url);

                            await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('items').doc(route.params.item.name).set({
                            name: name,
                            price: [priceDollar,priceCents].join('.'),
                            section: section,
                            description: description,
                            img: url
                        }, {merge: true})

                        const itemsTemp = authContext.items.map((x)=> {
                            if (x["name"]===route.params.item.name){
                                return ({
                                    name: route.params.item.name,
                                    price: [priceDollar,priceCents].join('.'),
                                    section: section,
                                    description: description,
                                    img: url
                                })
                            } else{
                                return x
                            };
                        })
                        
                        await authContext.setItems(itemsTemp) ;

                        })
                        .catch((error)=>{
                            setErrorMessage('Please click submit changes again.');
                            
                        });

                        
                                
                            });
                            //var picturesTemp = authContext.storeData.pictures;
                            //picturesTemp[i] = await ref.getDownloadURL();
                            //var imageURL = await ref.getDownloadURL();
                            //    await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).set({
                            //        pictures: picturesTemp
                            //    }, {merge: true})
                        }
                    const addons = await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('items').doc(route.params.item.name).collection('add-ons').get();

                    addons.docs.map(async (addon, i)=>{
                        await addon.ref.delete();
                    })

                    preferences.map(async (preference, i) =>{
                        await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('items').doc(route.params.item.name).collection('add-ons').doc(preference["name"]).set({
                            name: preference["name"],
                            required: preference["required"],
                            number: preference["number"],
                            repeats: false,
                            choices: preference["choices"],
                            prices: preference["prices"]
                        })
                    })

                    const newSections = [];
                    sections.map(async (sec, i)=>{
                        var count = 0;
                        authContext.items.map(async(item, b)=>{
                            if (item["name"]!==route.params.item["name"]){
                                if (item["section"]===sec){
                                    count+=1;
                                }
                            }
                        })
                        if (section===sec){
                            count+=1;
                        }

                        if (count>0){
                            newSections.push(sec);
                        }
                    })
                    await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).set({
                        sections: newSections
                    }, {merge: true});
                    authContext.getStore();
                    await new Promise(resolve => setTimeout(resolve, 500));
                    setSubmittingChanges(false);
                    navigation.navigate("Items");
                    }}>
                        <Text style={{color: 'white', alignSelf: 'center', fontWeight: '500'}}>Submit changes</Text>
                </TouchableOpacity>

                <Text style={{alignSelf: 'center', color: 'red', marginTop: 0}}>{errorMessage}</Text>
                {submittingChanges ? <ActivityIndicator size='large' /> : null}

                    <TouchableOpacity onPress={()=>{
                        setDeleteItemModal(true);
                    }}>
                    <Text style={{alignSelf: 'center',  marginTop: 5, fontSize: 13, color: 'gray'}}>Delete item</Text>
                    </TouchableOpacity>

                <View style={{height: 100}}></View>


            </ScrollView>


                {/* EDIT NAME MODAL */}
            <Modal visible={nameModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
            <View style={{height: 150, width: '90%', backgroundColor: 'white', position: 'absolute', top: '25%', left: '5%', borderRadius: 15, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
                <View style={{backgroundColor: 'white',
                    borderRadius: 10,
                    position: 'absolute',
                    zIndex: 50,
                    marginTop: 5,
                    width: '100%',
                    alignSelf: 'center'
                    }}> 

                    <Text style={{alignSelf: 'center', marginTop: 20, fontWeight: 'bold'}}>Name</Text>

                    <InputField
                        inputStyle={{
                        fontSize: 14,
                        }}
                        containerStyle={{
                        width: '90%',
                        zIndex: 600,
                        paddingBottom: 2,
                        paddingTop: -2,
                        marginVertical: 2,
                        paddingHorizontal: 5,
                        backgroundColor: '#e8eded',
                        borderWidth: 1,
                        borderColor: 'lightgray',
                        alignSelf: 'center',
                        marginTop: 20
                        }}
                        placeholder={"Name"}
                        autoFocus={false}
                        autoCapitalize='sentences'
                        keyboardType= {'default'}
                        textContentType='telephoneNumber'
                        value={String(prefName)}
                        autoFocus={false}
                        maxLength={50}
                        numberOfLines={1}
                        onChangeText={text => {
                            setPrefName(text);
                        }}
                        secureTextEntry={false}
                    /> 

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 20}} onPress={async ()=>{
                        const preferencesTemp = preferences.map((x)=>x);
                        preferencesTemp[preferenceIndex]["name"]=prefName;
                        await Firebase.storage().ref().child(`${authContext.storeData.restaurant_id}/`+prefName);
                        setPreferences(preferencesTemp);
                        setNameModal(false);
                        
                    }}>
                        <Text>Submit</Text>
                    </TouchableOpacity>

                     

                
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
                        setNameModal(false);
                    }}>
                    <Text style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontSize: 15, padding: 5}}><MaterialCommunityIcons name="close" size={20} color='gray'/></Text>
                </TouchableOpacity>
            </View>
            </View>
            </Modal>


            {/* NUM SELECTIONS Modal */}

        <Modal visible={numChoicesModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
            <View style={{height: 150, width: '90%', backgroundColor: 'white', position: 'absolute', top: '25%', left: '5%', borderRadius: 15, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
                <View style={{backgroundColor: 'white',
                    borderRadius: 10,
                    position: 'absolute',
                    zIndex: 50,
                    marginTop: 5,
                    width: '100%',
                    alignSelf: 'center'
                    }}> 

                    <Text style={{alignSelf: 'center', marginTop: 20, fontWeight: 'bold'}}>Number of choices user can select</Text>

                    <InputField
                        inputStyle={{
                        fontSize: 14,
                        }}
                        containerStyle={{
                        width: '9d0%',
                        zIndex: 600,
                        paddingBottom: 2,
                        paddingTop: -2,
                        marginVertical: 2,
                        paddingHorizontal: 5,
                        backgroundColor: '#e8eded',
                        borderWidth: 1,
                        borderColor: 'lightgray',
                        alignSelf: 'center',
                        marginTop: 20
                        }}
                        placeholder={" d d"}
                        autoFocus={false}
                        autoCapitalize='sentences'
                        keyboardType= {'number-pad'}
                        textContentType='telephoneNumber'
                        value={String(prefNum)}
                        autoFocus={false}
                        maxLength={2}
                        numberOfLines={1}
                        onChangeText={text => {
                            setPrefNum(text)
                        }}
                        secureTextEntry={false}
                    /> 

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 20}} onPress={()=>{
                        const preferencesTemp = preferences.map((x)=>x);
                        preferencesTemp[preferenceIndex]["number"]=prefNum;
                        setPreferences(preferencesTemp);
                        setNumChoicesModal(false);
                        
                    }}>
                        <Text>Submit</Text>
                    </TouchableOpacity>

                     

                
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
                        setNumChoicesModal(false);
                    }}>
                    <Text style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontSize: 15, padding: 5}}><MaterialCommunityIcons name="close" size={20} color='gray'/></Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>


                {/* REQUIRED PREFERENCES MODAL */}
        <Modal visible={requiredModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
            <View style={{height: 150, width: '90%', backgroundColor: 'white', position: 'absolute', top: '25%', left: '5%', borderRadius: 15, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
                <View style={{backgroundColor: 'white',
                    borderRadius: 10,
                    position: 'absolute',
                    zIndex: 50,
                    marginTop: 5,
                    width: '100%',
                    alignSelf: 'center'
                    }}> 

                    <Text style={{alignSelf: 'center', marginTop: 20, fontWeight: 'bold'}}>Is this a required selection?</Text>

                    {prefRequired ? 
                            <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 20}}> 
                            <TouchableOpacity style={{width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: 'black', backgroundColor: 'white'}}>
                                <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: 'black', alignSelf: 'center', marginTop: 2}}></View>
                            </TouchableOpacity>
                            <Text style={{marginLeft: 5}}>True</Text>

                            <TouchableOpacity onPress={()=>{setPrefRequired(false)}} style={{width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: 'black', backgroundColor: 'white', marginLeft: 10}}>
                            </TouchableOpacity>
                            <Text style={{marginLeft: 5}}>False</Text>
                            </View> :

                            <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 20}}> 
                            <TouchableOpacity onPress={()=>{setPrefRequired(true)}}  style={{width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: 'black', backgroundColor: 'white'}}>
                            </TouchableOpacity>
                            <Text style={{marginLeft: 5}}>True</Text>

                            <TouchableOpacity style={{width: 16, height: 16, borderRadius: 8, borderWidth: 1, borderColor: 'black', backgroundColor: 'white', marginLeft: 10}}>
                                <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: 'black', alignSelf: 'center', marginTop: 2}}></View>
                            </TouchableOpacity>
                            <Text style={{marginLeft: 5}}>False</Text>
                            </View> }

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 20}} onPress={()=>{
                        const preferencesTemp = preferences.map((x)=>x);
                        if (prefRequired===true){
                            preferencesTemp[preferenceIndex]["required"]=true;
                            preferencesTemp[preferenceIndex]["number"]=1
                        } else{
                            preferencesTemp[preferenceIndex]["required"]=false;
                            
                        }
                        
                        setPreferences(preferencesTemp);
                        setRequiredModal(false);
                        
                    }}>
                        <Text>Submit</Text>
                    </TouchableOpacity>

                     

                
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
                        setRequiredModal(false);
                    }}>
                    <Text style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontSize: 15, padding: 5}}><MaterialCommunityIcons name="close" size={20} color='gray'/></Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal>

                        {/* EDIT CHOICE AND PRICE MODAL */}

        <Modal visible={editChoiceModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
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
                        value={String(prefPrice)}
                        autoFocus={false}
                        maxLength={50}
                        numberOfLines={1}
                        onChangeText={text => {
                            setPrefPrice(text);
                        }}
                        secureTextEntry={false}
                    /> 
                    </View>

                    </View>

                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 10, margin: 30}} onPress={()=>{
                            const preferencesTemp = preferences.map((x)=>x);
                            if (preferencesTemp[preferenceIndex]["choices"].length>1){
                                preferencesTemp[preferenceIndex]["choices"].splice(choiceIndex, 1)
                                preferencesTemp[preferenceIndex]["prices"].splice(choiceIndex, 1)
                                setPreferences(preferencesTemp);
                                setEditChoiceModal(false);   
                            }
                                                 
                    }}>
                        <Text>Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 10, margin: 30}} onPress={()=>{
                        if (isNaN(prefPrice)===false){
                            const preferencesTemp = preferences.map((x)=>x);
                            preferencesTemp[preferenceIndex]["choices"][choiceIndex]=choice;
                            preferencesTemp[preferenceIndex]["prices"][choiceIndex]=prefPrice;
                            setPreferences(preferencesTemp);
                            setEditChoiceModal(false);
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
                        setEditChoiceModal(false);
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

        <Modal visible={addChoiceModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
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
                        value={String(prefPrice)}
                        autoFocus={false}
                        maxLength={50}
                        numberOfLines={1}
                        onChangeText={text => {
                            setPrefPrice(text);
                        }}
                        secureTextEntry={false}
                    /> 
                    </View>

                    </View>

                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 10, margin: 30}} onPress={()=>{
                        if (isNaN(prefPrice)===false){
                            const preferencesTemp = preferences.map((x)=>x);
                            preferencesTemp[preferenceIndex]["choices"].push(choice);
                            preferencesTemp[preferenceIndex]["prices"].push(prefPrice);
                            setPreferences(preferencesTemp);
                            setAddChoiceModal(false);
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
                        setAddChoiceModal(false);
                    }}>
                    <Text style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontSize: 15, padding: 5}}><MaterialCommunityIcons name="close" size={20} color='gray'/></Text>
                </TouchableOpacity>
            </View>
            </View>
            </Modal>

            {/* MODAL FOR DELETING PREFERENCES */}

        <Modal visible={deleteModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
            <View style={{height: 150, width: '90%', backgroundColor: 'white', position: 'absolute', top: '25%', left: '5%', borderRadius: 15, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
                <View style={{backgroundColor: 'white',
                    borderRadius: 10,
                    position: 'absolute',
                    zIndex: 50,
                    marginTop: 5,
                    width: '100%',
                    alignSelf: 'center'
                    }}> 


                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <View style={{width: '94%', margin: 5}}>

                    <Text style={{alignSelf: 'center', marginTop: 40}}>Are you sure you want to delete this preference?</Text>

                    </View>
                    </View>

                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 10, margin: 30}} onPress={()=>{
                            const preferencesTemp = preferences.map((x)=>x);
                            preferencesTemp.splice(preferenceIndex, 1)
                            setPreferences(preferencesTemp);
                            setDeleteModal(false);   
                                                 
                    }}>
                        <Text>Yes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 10, margin: 30}} onPress={()=>{
                        setDeleteModal(false);
                        
                    }}>
                        <Text>No</Text>
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
                        setDeleteModal(false);
                    }}>
                    <Text style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontSize: 15, padding: 5}}><MaterialCommunityIcons name="close" size={20} color='gray'/></Text>
                </TouchableOpacity>
            </View>
            </View>
            </Modal>



                        {/* DELETE ITEM MODAL */}
            <Modal visible={deleteItemModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
            <View style={{height: 150, width: '90%', backgroundColor: 'white', position: 'absolute', top: '25%', left: '5%', borderRadius: 15, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
                <View style={{backgroundColor: 'white',
                    borderRadius: 10,
                    position: 'absolute',
                    zIndex: 50,
                    marginTop: 5,
                    width: '100%',
                    alignSelf: 'center'
                    }}> 


                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <View style={{width: '94%', margin: 5}}>

                    <Text style={{alignSelf: 'center', marginTop: 40}}>Are you sure you want to delete this item?</Text>

                    </View>
                    </View>

                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 10, margin: 30}} onPress={async ()=>{
                            // 1.Check sections
                            // 2. delete from firebase
                            // 3. Delete from authcontext.items

                            const newSections = [];
                            sections.map(async (sec, i)=>{
                                var count = 0;
                                authContext.items.map(async(item, b)=>{
                                    if (item["name"]!==route.params.item["name"]){
                                        if (item["section"]===sec){
                                            count+=1;
                                        }
                                    }
                                })
                                if (count>0){
                                    newSections.push(sec);
                                }
                            })
                            setDeleteItemModal(false);     
                            await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).set({
                                sections: newSections
                            }, {merge: true});


                            const addOnDelete = await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('items').doc(route.params.item["name"]).collection('add-ons').get();
                            addOnDelete.docs.map((addon, i)=>{
                                addon.ref.delete();
                            })

                            await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('items').doc(route.params.item["name"]).delete();
                            authContext.getStore();  
                                                 
                            getItems().then(()=>{
                                
                                navigation.pop(1); 
                            })
                            
                    }}>
                        <Text>Yes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 10, margin: 30}} onPress={()=>{
                        setDeleteItemModal(false);
                        
                    }}>
                        <Text>No</Text>
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
                        setDeleteItemModal(false);
                    }}>
                    <Text style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontSize: 15, padding: 5}}><MaterialCommunityIcons name="close" size={20} color='gray'/></Text>
                </TouchableOpacity>
            </View>
            </View>
            </Modal>


                 






                        {/* ITEM PICTURE MODAL */}
            <Modal visible={uploadImageModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
            <View style={{height: 220, width: '90%', backgroundColor: 'white', position: 'absolute', top: '25%', left: '5%', borderRadius: 15, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
                <View style={{backgroundColor: 'white',
                    borderRadius: 10,
                    position: 'absolute',
                    margin: 10,
                    marginHorizontal: 10,
                    zIndex: 50,
                    marginTop: 10,
                    width: '90%',
                    alignSelf: 'center'
                    }}> 
                    
                    <View style={{flexDirection: 'row', width: '95%', alignItems: 'center', alignSelf: 'center'}}>

                    <View style={{marginTop: 50, width: '100%', borderWidth: 1, borderColor: 'gray', height: 30, padding: 5, borderRadius: 5,  alignSelf: 'center'}}>
                        <Text>{uriText}</Text>
                    </View>
                    </View>

                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <TouchableOpacity style={{marginTop: 10, backgroundColor: '#44bec6', padding: 5, width: '35%', borderRadius: 5, height: 30, margin: 5}} onPress={()=>selectImage("Temp")}>
                        <Text style={{color: 'white', fontWeight: '500', alignSelf: 'center'}}>Select image</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={{marginTop: 10, backgroundColor: '#44bec6', padding: 5, width: '35%', borderRadius: 5, height: 30, margin: 5}} onPress={()=>selectImage(photoIndex)}>
                        <Text style={{color: 'white', fontWeight: '500', alignSelf: 'center'}}>Upload to store</Text>
                    </TouchableOpacity> */}

                    </View>

                    {loadingState === 0 ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 15 }}><Text style={{color: 'green', marginTop: 10}}>Please select an image to upload to your store.</Text></View> : null}
                    {loadingState === 1 ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                             <ActivityIndicator size='large' />
                           </View> : null}
                    {loadingState === 2 ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 15 }}><MaterialCommunityIcons name = "check-circle" color='green' size={25} /><Text style={{color: 'green', marginTop: 5}}>Please wait a minute for changes to take effect.</Text></View> : null}


                
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
                        setLoadingState(0);
                        setUploadImageModal(false)
                    }}>
                    <Text style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontSize: 15, padding: 5}}><MaterialCommunityIcons name="close" size={20} color='gray'/></Text>
                </TouchableOpacity>
            </View>
            </View>
            </Modal>

                {/* ITEM DESCRIPTION MODAL */}
            <Modal visible={itemDescriptionModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
            <View style={{height: 250, width: '90%', backgroundColor: 'white', position: 'absolute', top: '25%', left: '5%', borderRadius: 15, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
                <View style={{backgroundColor: 'white',
                    borderRadius: 10,
                    position: 'absolute',
                    zIndex: 50,
                    marginTop: 5,
                    width: '100%',
                    alignSelf: 'center'
                    }}> 

                    <Text style={{alignSelf: 'center', marginTop: 20, fontWeight: 'bold'}}>Edit description</Text>

                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <View style={{width: '90%', margin: 5}}>

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
                        marginTop: 5,
                        height: 140
                        }}
                        placeholder={"Description"}
                        autoFocus={false}
                        autoCapitalize='sentences'
                        keyboardType= {'default'}
                        textContentType='telephoneNumber'
                        value={modalInput}
                        autoFocus={false}
                        maxLength={300}
                        numberOfLines={1}
                        onChangeText={text => {
                            setModalInput(text);
                        }}
                        secureTextEntry={false}
                    /> 

                    </View>

                    </View>

                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 10, margin: 30}} onPress={()=>{
                        setDescription(modalInput)
                        setItemDescriptionModal(false);
                        
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
                        setItemDescriptionModal(false);
                    }}>
                    <Text style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontSize: 15, padding: 5}}><MaterialCommunityIcons name="close" size={20} color='gray'/></Text>
                </TouchableOpacity>
            </View>
            </View>
            </Modal>



            {/* ITEM PRICE MODAL */}
            <Modal visible={itemPriceModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
            <View style={{height: 250, width: '90%', backgroundColor: 'white', position: 'absolute', top: '25%', left: '5%', borderRadius: 15, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
                <View style={{backgroundColor: 'white',
                    borderRadius: 10,
                    position: 'absolute',
                    zIndex: 50,
                    marginTop: 5,
                    width: '100%',
                    alignSelf: 'center'
                    }}> 

                    <Text style={{alignSelf: 'center', marginTop: 20, fontWeight: 'bold'}}>Edit price</Text>

                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <View style={{width: '90%', margin: 5}}>

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
                        placeholder={"Description"}
                        autoFocus={false}
                        autoCapitalize='sentences'
                        keyboardType= {'default'}
                        textContentType='telephoneNumber'
                        value={modalInput}
                        autoFocus={false}
                        maxLength={250}
                        numberOfLines={1}
                        onChangeText={text => {
                            setModalInput(String(text));
                        }}
                        secureTextEntry={false}
                    /> 

                    </View>

                    </View>

                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 10, margin: 30}} onPress={async ()=>{
                        if (isNaN(modalInput)===false){
                            setPriceDollar(Number(modalInput.split(".")[0]));
                            if (modalInput.split('.').length===2){
                                setPriceCents(Number(modalInput.split('.')[1]));
                            } else{
                                setPriceCents(0);
                            }
                        }
                        setItemPriceModal(false);
                        
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
                        setItemPriceModal(false);
                    }}>
                    <Text style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontSize: 15, padding: 5}}><MaterialCommunityIcons name="close" size={20} color='gray'/></Text>
                </TouchableOpacity>
            </View>
            </View>
            </Modal>


            {/* ITEM SECTION MODAL */}
            <Modal visible={itemSectionModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
            <View style={{height: 180, width: '90%', backgroundColor: 'white', position: 'absolute', top: '25%', left: '5%', borderRadius: 15, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
                <View style={{backgroundColor: 'white',
                    borderRadius: 10,
                    position: 'absolute',
                    zIndex: 50,
                    marginTop: 5,
                    width: '100%',
                    alignSelf: 'center'
                    }}> 

                    <Text style={{alignSelf: 'center', marginTop: 20, fontWeight: 'bold'}}>Edit section</Text>

                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <View style={{width: '90%', margin: 5, marginTop: 15}}>

                    <SelectDropdown
                        data={sections}
                        onSelect={(selectedItem, index)=>{
                            if (selectedItem === '+ Add section'){
                                console.log(' ADDING SECTION')
                                setModalInput('')
                                setAddSection(true);
                            } else{
                                setAddSection(false);
                                setModalInput(selectedItem);
                            }
                            
                        }}
                        buttonTextAfterSelection={(selectedItem, index)=>{
                            return selectedItem
                        }}

                        rowTextForSelection={(item, index)=>{
                            return item
                        }}

                        buttonStyle={{width: '100%', alignSelf: 'center', backgroundColor: '#e8eded', borderColor: 'lightgray', borderWidth: 1, height: 25, borderRadius: 5}}
                        buttonTextStyle={{fontSize: 14}}
                        rowStyle={{width: '100%', alignSelf: 'center', backgroundColor: '#e8eded', borderColor: 'lightgray', borderWidth: 1, height: 25}}
                        rowTextStyle={{fontSize: 14}}
                    />

                    {addSection ? <InputField
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
                        placeholder={"Enter new section name"}
                        autoFocus={false}
                        autoCapitalize='sentences'
                        keyboardType= {'default'}
                        textContentType='telephoneNumber'
                        value={modalInput}
                        autoFocus={false}
                        maxLength={250}
                        numberOfLines={1}
                        onChangeText={text => {
                            setModalInput(String(text));
                        }}
                        secureTextEntry={false}
                    /> : <View style={{height: 30}}></View>}

                    </View>

                    </View>

                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 10, margin: 30}} onPress={async ()=>{
                        if (addSection === true){
                            setSection(modalInput)
                            setSections(sections.splice(0, sections.length-1).concat([modalInput]).concat(['+ Add section']))
                            setAddSection(false);
                        } else{
                            setSection(modalInput);
                        }
                        setItemSectionModal(false);
                        
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
                        setItemSectionModal(false);
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
 
    </View>
    
  );
}
