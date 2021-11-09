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

export default function AddItem({route}) {
    const authContext = useContext(AuthContext)
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [section, setSection] = useState('');
    const [image, setImage] = useState('')
    const [uploadImageModal, setUploadImageModal] = useState(false)
    const [uriText, setUriText] = useState('Please select an image from your photos')
    const [loadingState, setLoadingState] = useState(0);
    const [priceDollar, setPriceDollar] = useState(0);
    const [priceCents, setPriceCents] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [preferencesBool, setPreferencesBool] = useState(new Array(authContext.restaurantPreferences).fill(false));

    //Modals
    const [modalInput, setModalInput] = useState('');
    const [sections, setSections] = useState(authContext.storeData.sections.concat(['+ Add section']));
    const [addSection, setAddSection] = useState(false);
    const [submittingChanges, setSubmittingChanges] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);

    const navigation = useNavigation();

    const getItems = async () => {
        const itemsTemp = [];
        const firebaseItems = await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('items').get();
        firebaseItems.docs.map((item, i)=>{
            itemsTemp.push(item.data());
            console.log(item.data());
        })
        authContext.setItems(itemsTemp);
    }

   const selectImage = async (fileName) => {

        let result = await launchImageLibraryAsync()
        //console.log(result)
        var name = name
        setImageLoading(true);
        
        if (!result.cancelled){
           await setLoadingState(1);
           await setUriText(result.uri)
           console.log(result.uri)
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
        setImageLoading(false);
    };

    const uploadImage = async (uri, imageName) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        const ref = await Firebase.storage().ref().child(`${authContext.storeData.restaurant_id}/`+imageName)


        //const storage = await Firebase.ref(Firebase.storage(), `${authContext.storeData.restaurant_id}/`+imageName)
        return ref.put(blob);

    }


  return (
    <View style={{height: Dimensions.get("screen").height, width: '100%', marginTop: 'auto', backgroundColor: 'white', paddingVertical: 50}}>
        <View style={{width: '100%', alignSelf: 'center'}}>
            <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            <TouchableOpacity  onPress={()=>navigation.pop(1)}>
            <MaterialCommunityIcons name="arrow-left" size={25}/>
            </TouchableOpacity>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginHorizontal: 10, paddingBottom: 10, marginTop: 3}}>Add Item</Text>
            </View>
            <ScrollView style={{height: '100%', width: '90%', alignSelf: 'center'}} showsVerticalScrollIndicator={false}>

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

                <Text style={{marginTop: 5, fontSize: 13, color: 'gray', fontStyle: 'italic'}}>* Please ensure accuracy as you will not be able to edit the item's name later.</Text>

                <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Text style={{width: '30%', paddingVertical: 5, fontWeight: 'bold'}}>Image:</Text>

                    <TouchableOpacity style={{position: 'absolute', right: 0}} onPress={()=>{setUriText('Please select an image from your photos'); setUploadImageModal(true)}}>
                        <Text style={{color: 'gray', marginTop: 3}}>+ Upload new image</Text>
                    </TouchableOpacity>
                </View>

                {image !== '' ? <CachedImage style={{width: '100%', maxHeight: 300, alignSelf: 'center', resizeMode: "cover", borderRadius: 15}} source = {{uri: image}} onLoadStart={() => setImageLoading(true)} onLoadEnd={() => {setImageLoading(false)}}/> : null}
                {imageLoading ? <ActivityIndicator size='large' style={{marginTop: -150, marginBottom: 150}}/> : null}
                <Text style={{marginTop: 5, fontSize: 13, color: 'gray', fontStyle: 'italic'}}>* Uploading an image of your item increases sales and visibility to your store.</Text>

                <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text style={{width: '30%', paddingVertical: 5, marginTop: 5, fontWeight: 'bold'}}>Description:</Text>

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

            <Text style={{marginTop: 5, fontSize: 13, color: 'gray', fontStyle: 'italic'}}>* Short description of your item (max 300 chars, not required).</Text>

            <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text style={{width: '30%', marginTop:10, fontWeight: 'bold'}}>Price:</Text>

                <Text style={{marginTop: 10}}>$</Text>
                <InputField
                        inputStyle={{
                        fontSize: 14,
                        }}
                        containerStyle={{
                        width: 30,
                        zIndex: 600,
                        paddingBottom: 2,
                        paddingTop: -2,
                        marginVertical: 2,
                        paddingHorizontal: 5,
                        backgroundColor: '#e8eded',
                        borderWidth: 1,
                        borderColor: 'lightgray',
                        alignSelf: 'right',
                        textAlign: 'right',
                        marginTop: 5
                        }}
                        placeholder={""}
                        autoCapitalize='sentences'
                        keyboardType= {'number-pad'}
                        textContentType='telephoneNumber'
                        value={String(priceDollar)}
                        maxLength={2}
                        numberOfLines={1}
                        onChangeText={text => {
                            setPriceDollar(text);
                        }}
                        secureTextEntry={false}
                    /> 

                <Text style={{marginTop: 10, marginHorizontal: 2}}>.</Text>
                <InputField
                        inputStyle={{
                        fontSize: 14,
                        }}
                        containerStyle={{
                        width: 30,
                        zIndex: 600,
                        paddingBottom: 2,
                        paddingTop: -2,
                        marginVertical: 2,
                        paddingHorizontal: 5,
                        backgroundColor: '#e8eded',
                        borderWidth: 1,
                        borderColor: 'lightgray',
                        alignSelf: 'right',
                        textAlign: 'right',
                        marginTop: 5
                        }}
                        placeholder={""}
                        autoCapitalize='sentences'
                        keyboardType= {'number-pad'}
                        textContentType='telephoneNumber'
                        value={String(priceCents)}
                        maxLength={2}
                        numberOfLines={1}
                        onChangeText={text => {
                            setPriceCents(text);
                        }}
                        secureTextEntry={false}
                    /> 

            </View>
             <Text style={{marginTop: 5, fontSize: 13, color: 'gray', fontStyle: 'italic'}}>* Enter dollars to the left of the decimal and cents to the right of the decimal.</Text>

            <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text style={{width: '30%', marginTop:10, fontWeight: 'bold'}}>Section:</Text>

                <View style={{width: '70%'}}>

                <SelectDropdown
                        data={sections}
                        onSelect={(selectedItem, index)=>{
                            if (selectedItem === '+ Add section'){
                                console.log(' ADDING SECTION')
                                setSection('')
                                setAddSection(true);
                            } else{
                                setAddSection(false);
                                setSection(selectedItem)
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
                    /> : null}

                    </View>

            </View>

            <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text style={{width: '30%', marginTop:10, fontWeight: 'bold'}}>Preferences:</Text>

                {/* <TouchableOpacity style={{position: 'absolute', right: 0, marginTop: 10}} onPress={()=>navigation.navigate("Add Preference")}>
                    <Text style={{color: 'gray'}}>Add preference</Text>
                </TouchableOpacity> */}

            </View>

            <Text style={{marginTop: 5, fontSize: 13, color: 'gray', fontStyle: 'italic', marginBottom: 20}}>* You can customize preferences/add new preferences after submitting this item.</Text>

            {/* {preferences.length=== 0 ? <Text style={{marginTop: 15, fontSize: 13, color: 'gray', fontStyle: 'italic'}}>There are no preferences for this item.</Text> : null} */}
                

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

                <TouchableOpacity disabled={submittingChanges} 
                
                style={{marginTop: 50, margin: 30, marginBottom: 10, backgroundColor: '#44bec6', padding: 5, width: '35%', borderRadius: 5, alignSelf: 'center', height: 30}}
                onPress={async ()=>{
                    if (name===''){
                        setErrorMessage('Please enter an item name.')
                    } else if (isNaN(priceDollar) || isNaN(priceCents)){
                        setErrorMessage('Please enter a valid item price.')
                    } else if (Number(priceDollar)===0 && Number(priceCents)===0){
                        setErrorMessage('Please enter a valid item price.')
                    } else if (section === ''){
                        setErrorMessage('Please enter an item section.')
                    } else{
                        await setErrorMessage('');
                        await setSubmittingChanges(true);
                        if (uriText === 'Please select an image from your photos'){
                        console.log("UPLOADING WITHOUT URI")
                        await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('items').doc(name).set({
                            name: name,
                            description: description,
                            price: Number([priceDollar,priceCents].join('.')),
                            section: section
                        })
                        } else{
                        console.log("UPLOADING WITH URI")
                        uploadImage(uriText, name)
                            .then(async (data)=>{
                                
                                data.ref.getDownloadURL().then(async (url)=>{
                                    setImage('');
                                    setImage(url);
                                    setLoadingState(2);
                                    await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('items').doc(name).set({
                                        name: name,
                                        description: description,
                                        price: Number([priceDollar,priceCents].join('.')),
                                        section: section,
                                        img: url
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
                        })   
                    }
                        preferencesBool.map(async (pref, j)=>{
                            if (pref===true){
                                await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('items').doc(name).collection('add-ons').doc(authContext.restaurantPreferences[j]["name"]).set({
                                    name: authContext.restaurantPreferences[j]["name"],
                                    description: authContext.restaurantPreferences[j]["description"],
                                    number: authContext.restaurantPreferences[j]["number"],
                                    required: authContext.restaurantPreferences[j]["required"],
                                    repeats: authContext.restaurantPreferences[j]["repeats"],
                                    choices: authContext.restaurantPreferences[j]["choices"],
                                    prices: authContext.restaurantPreferences[j]["prices"]
                                })
                            }
                        })
                        await new Promise(resolve => setTimeout(resolve, 500));
                        await setUriText('Please select an image from your photos')
                        getItems().then(()=>{
                            setSubmittingChanges(false);
                            navigation.navigate("Items");

                        }
                        );
                        
                    }}}>
                        <Text style={{alignSelf: 'center', textAlign: 'center', color: 'white', fontWeight: '500'}}>Submit item</Text>
                </TouchableOpacity>

                <Text style={{alignSelf: 'center', color: 'red', marginTop: 10, alignSelf: 'center', textAlign: 'center'}}>{errorMessage}</Text>
                {submittingChanges ? <ActivityIndicator size='large' /> : null}




                <View style={{height: 100}}></View>


            </ScrollView>

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
                                    setUploadImageModal(false)
                                    setLoadingState(0);
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
