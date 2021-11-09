import React, {useContext, useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import {ImagePicker, launchImageLibraryAsync} from 'expo-image-picker'
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import {  ActivityIndicator, FormData, Modal, ScrollView, Dimensions, TouchableOpacity, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { TouchableHighlight, Button, TextInput, Screen, Image, Platform} from 'react-native'
import {Firebase, db} from '../config/firebase';
import AuthContext from '../context/Context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CachedImage from 'react-native-expo-cached-image'


const Stack = createStackNavigator();

export default function StorePhotos({navigation}) {
  const authContext = useContext(AuthContext)
  const [uploadImageModal, setUploadImageModal] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [uriText, setUriText] = useState('');
  const [urlState, setUrlState] = useState('');
  const [loadingState, setLoadingState] = useState(0);
  const [photo1Loading, setPhoto1Loading] = useState(false);
  const [photo2Loading, setPhoto2Loading] = useState(false);
  const auth = Firebase.auth();
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setLoggedIn(false);
    } catch (error) {
    }
  };

    const selectImage = async (i) => {

        let result = await launchImageLibraryAsync()
        console.log(result)
        var name = ''
        if (i===0){
            name = "Picture 1";
        } else{
            name = "Picture 2";
        }
        if (!result.cancelled){
            await setLoadingState(1);
            console.log(loadingState);
           setUriText(result.uri)
           uploadImage(result.uri, name, i)
           .then(async (data)=>{
                data.ref.getDownloadURL().then(async (url)=>{
                var picturesTemp = authContext.storeData.pictures;
                picturesTemp[i] = url;
                await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).set({
                   pictures: picturesTemp
                }, {merge: true})
                await setLoadingState(2);
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
    };

    const uploadImage = async (uri, imageName, i) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        var ref = await Firebase.storage().ref().child(`${authContext.storeData.restaurant_id}/`+imageName);
        //const storage = await Firebase.ref(Firebase.storage(), `${authContext.storeData.restaurant_id}/`+imageName)
        return ref.put(blob);
    }

  return (
    <View style={{height: Dimensions.get("screen").height, width: '100%', marginTop: 'auto', backgroundColor: 'white', paddingVertical: 50}}>
        <View style={{width: '100%', alignSelf: 'center'}}>
            <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            <TouchableOpacity onPress={()=>navigation.pop(1)}>
            <MaterialCommunityIcons name="arrow-left" size={25}/>
            </TouchableOpacity>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginHorizontal: 10, paddingBottom: 10, marginTop: 3}}>Store Photos</Text>
            </View>

            <ScrollView style={{height: '100%'}}>

            <View style={{flexDirection: 'row', width: '95%', alignSelf: 'center', marginBottom: 10, marginTop: 10}}>
            <Text style={{fontSize: 17, fontWeight: 'bold'}}>Photo 1</Text>
            <TouchableOpacity style={{position: 'absolute', right: 0}} onPress={()=>{setPhotoIndex(0); setLoadingState(0); setUploadImageModal(true)}}>
                <Text style={{color: 'gray'}}>Select another photo</Text>
            </TouchableOpacity>
            </View>
            
            <CachedImage style={{width: '95%', height: 300, alignSelf: 'center', resizeMode: "cover", borderRadius: 15}} source={{uri: authContext.storeData.pictures[0]}} onLoadStart={() => setPhoto1Loading(true)}
                                   onLoadEnd={() => {
                                       setPhoto1Loading(false)}}/>
            {photo1Loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -170, marginBottom: 150 }}>
                             <ActivityIndicator size='large' />
                           </View> : null}
            

             <View style={{flexDirection: 'row', width: '95%', alignSelf: 'center', marginBottom: 10, marginTop: 15}}>
            <Text style={{fontSize: 17, fontWeight: 'bold'}}>Photo 2</Text>
            <TouchableOpacity style={{position: 'absolute', right: 0}} onPress={()=>{setPhotoIndex(1); setLoadingState(0); setUploadImageModal(true)}}>
                <Text style={{color: 'gray', textAlignVertical: 'bottom'}}>Select another photo</Text>
            </TouchableOpacity>
            </View>
            
            <CachedImage style={{width: '95%', height: 300, alignSelf: 'center', resizeMode: 'cover', borderRadius: 15}} source={{uri: authContext.storeData.pictures[1]}} onLoadStart={() => setPhoto2Loading(true)} onLoadEnd={() => {setPhoto2Loading(false)}}/>
            {photo2Loading ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -170, marginBottom: 150}}>
                             <ActivityIndicator size='large' />
                           </View> : null}

            <View style={{height: 200}}></View>
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
                    <TouchableOpacity style={{marginTop: 10, backgroundColor: '#44bec6', padding: 5, width: '35%', borderRadius: 5, height: 30, margin: 5}} onPress={()=>selectImage(photoIndex)}>
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
                    {loadingState === 2 ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 15 }}><MaterialCommunityIcons name = "check-circle" color='green' size={25} /><Text style={{color: 'green', marginTop: 10}}>Store photo may take a few minutes to update.</Text></View> : null}


                
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#bbded6'
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#8ac6d1',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#ffb6b9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center'
  },
  progressBarContainer: {
    marginTop: 20
  },
  imageBox: {
    width: 300,
    height: 300
  }
});