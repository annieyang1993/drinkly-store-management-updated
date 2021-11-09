import React, {useContext, useState, useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthenticatedUserContext } from '../navigation/AuthenticatedUserProvider';
import InputField from '../components/InputField'
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { Modal, ScrollView, Dimensions, TouchableOpacity, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { TouchableHighlight, Button, TextInput, Screen, Image, Platform} from 'react-native'
import {Firebase, db} from '../config/firebase';
import AuthContext from '../context/Context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Geocoder from 'react-native-geocoding';

const Stack = createStackNavigator();

export default function ContactInfo({navigation}) {
  const authContext = useContext(AuthContext)
  const [street, setStreet] = useState(authContext.storeData.street[0]);
  const [city, setCity] = useState(authContext.storeData.city);
  const [state, setState] = useState(authContext.storeData.state);
  const [phone, setPhone] = useState(authContext.storeData.phone);
  const [email, setEmail] = useState(authContext.storeData.email);
  const [editModal, setEditModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [keyboard, setKeyboard] = useState('default');
  const [modalInput, setModalInput] = useState('');
  const [errorMessageModal, setErrorMessageModal] = useState('');
  const [showErrorMessageBool, setShowErrorMessageBool] = useState(false);

  const auth = Firebase.auth();

    useEffect(()=>{
        Geocoder.init("AIzaSyB9fx4NpEW1D65AvgJjzY-npVoFUf17FRg");
    }, [])


  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setLoggedIn(false);
    } catch (error) {
    }
  };

  const handleSubmitPage = async () =>{
      Geocoder.from(`${street}, ${city}, ${state}, ${authContext.storeData.country}`)
		.then(async json => {
			var location = json.results[0].geometry.location;
            console.log(location);
            await Firebase.firestore().collection('restaurants').doc(`${authContext.storeData.restaurant_id}`).set({
                street: [street],
                city: city,
                state: state,
                phone: phone,
                email: email,
                latitude: location.lat,
                longitude: location.lng

            }, {merge: true})
            authContext.getStore();
            navigation.pop(1);
			
		})
		.catch(error => console.warn(error));

  }

  const handleSubmit = async () =>{
      if (modalTitle==='Street Address' && modalInput.length>0){
          await setStreet(modalInput);
          setModalInput('');
          setEditModal(false);
      } else if (modalTitle === 'City' && modalInput.length>0){
          await setCity(modalInput);
          setModalInput('');
          setEditModal(false);
      } else if (modalTitle === 'Province' && modalInput.length>0){
          await setState(modalInput);
          setModalInput('');
          setEditModal(false);
      } else if (modalTitle === 'Phone Number'){
          var submit = true;
          var numberString = '0123456789-'
          if (modalInput.length!==10){
              submit = false;

          } else{
              modalInput.split('').map((number, i)=>{
                  if (numberString.includes(number)===false){
                      submit=false
                  }
              })
          }
          if (submit===true){
            await setPhone(modalInput);
            setModalInput('');
            setEditModal(false);
            setErrorMessageModal('');
            setShowErrorMessageBool(false);
          } else{
              setErrorMessageModal('Invalid phone number.');
              setShowErrorMessageBool(true);
          }
          
      } else if (modalTitle === 'Email' && modalInput.length>0){
          var re = /\S+@\S+\.\S+/;
          if (re.test(modalInput)===true){
            await setEmail(modalInput);
            setModalInput('');
            setErrorMessageModal('');
            setShowErrorMessageBool(false);
            setEditModal(false);
          } else{
              setErrorMessageModal('Invalid email address format.');
              setShowErrorMessageBool(true);
          }

      }
  }

  return (
    <View style={{height: Dimensions.get("screen").height, width: '100%', marginTop: 'auto', backgroundColor: 'white', paddingVertical: 50}}>
            <View style={{width: '100%', alignSelf: 'center'}}>
            <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            <TouchableOpacity onPress={()=>navigation.pop(1)}>
            <MaterialCommunityIcons name="arrow-left" size={25}/>
            </TouchableOpacity>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginHorizontal: 10, paddingBottom: 10, marginTop: 3}}>Contact Info</Text>
            </View>
            <ScrollView style={{width: '92%', height: '100%', alignSelf: 'center'}}>
                <Text style={{marginTop: 10, marginBottom: 10}}>Street Address</Text>
                <View style={{backgroundColor: '#edf0f0', width: '100%', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, alignSelf: 'center', flexDirection: 'row'}}>
                <View style={{width: '80%'}}>
                <Text style={{textAlign: 'left', padding: 0}}>{street}</Text>
                </View>

                <TouchableOpacity style={{width: '20%', textAlign: 'right'}} onPress={async ()=>{
                    //await setStateType(street);
                    //await setStateFunction(setStreet());
                    await setModalTitle('Street Address');
                    await setKeyboard('default');
                    await setModalInput(street);
                    setEditModal(true)}}>
                <Text style={{textAlign: 'right', color: 'gray'}} >Edit</Text>
                </TouchableOpacity>
                </View>


                <Text style={{marginTop: 10, marginBottom: 10}}>City</Text>

                <View style={{backgroundColor: '#edf0f0', width: '100%', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, alignSelf: 'center', flexDirection: 'row'}}>

                <View style={{width: '80%'}}>
                <Text style={{textAlign: 'left', padding: 0}}>{city}</Text>
                </View>

                <TouchableOpacity style={{width: '20%', textAlign: 'right'}} onPress={async ()=>{
                    //await setStateType(street);
                    //await setStateFunction(setStreet());
                    await setModalTitle('City');
                    await setKeyboard('default');
                    await setModalInput(city);
                    setEditModal(true)}}>
                <Text style={{textAlign: 'right', color: 'gray'}} >Edit</Text>
                </TouchableOpacity>
                </View>

                

                <Text style={{marginTop: 10, marginBottom: 10}}>Province</Text>

                <View style={{backgroundColor: '#edf0f0', width: '100%', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, alignSelf: 'center', flexDirection: 'row'}}>

                <View style={{width: '80%'}}>
                <Text style={{textAlign: 'left', padding: 0}}>{state}</Text>
                </View>

                <TouchableOpacity style={{width: '20%', textAlign: 'right'}} onPress={async ()=>{
                    //await setStateType(street);
                    //await setStateFunction(setStreet());
                    await setModalTitle('Province');
                    await setKeyboard('default');
                    await setModalInput(state);
                    setEditModal(true)}}>
                <Text style={{textAlign: 'right',  color: 'gray'}} >Edit</Text>
                </TouchableOpacity>
                </View>


                <Text style={{marginTop: 10, marginBottom: 10}}>Country</Text>
                <View style={{backgroundColor: '#edf0f0', width: '100%', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, alignSelf: 'center', flexDirection: 'row'}}>

                    <Text style={{color: 'gray'}}>Canada (currency: CAD)</Text>
                </View>

                <Text style={{marginTop: 10, marginBottom: 10}}>Phone number</Text>

                <View style={{backgroundColor: '#edf0f0', width: '100%', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, alignSelf: 'center', flexDirection: 'row'}}>

                <View style={{width: '80%'}}>
                <Text style={{textAlign: 'left', padding: 0}}>{phone}</Text>
                </View>

                <TouchableOpacity style={{width: '20%', textAlign: 'right'}} onPress={async ()=>{
                    //await setStateType(street);
                    //await setStateFunction(setStreet());
                    await setModalTitle('Phone Number');
                    await setKeyboard('phone-pad');
                    await setModalInput(phone);
                    setEditModal(true)}}>
                <Text style={{textAlign: 'right',  color: 'gray'}} >Edit</Text>
                </TouchableOpacity>
                </View>
                
                

                <Text style={{marginTop: 10, marginBottom: 10}}>Email</Text>

                <View style={{backgroundColor: '#edf0f0', width: '100%', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, alignSelf: 'center', flexDirection: 'row'}}>

                <View style={{width: '80%'}}>
                    <Text style={{textAlign: 'left', padding: 0}}>{email}</Text>
                </View>

                <TouchableOpacity style={{width: '20%', textAlign: 'right'}} onPress={async ()=>{
                    //await setStateType(street);
                    //await setStateFunction(setStreet());
                    await setModalTitle('Email');
                    await setKeyboard('email-address');
                    await setModalInput(email);
                    setEditModal(true)}}>
                <Text style={{textAlign: 'right',  color: 'gray'}} >Edit</Text>
                </TouchableOpacity>
                </View>  

                <TouchableOpacity style={{margin: 50, alignSelf: 'center', marginTop: 150}} onPress={()=>{handleSubmitPage()}}>
                <Text >Submit</Text>
                </TouchableOpacity>

            </ScrollView>
            

            <Modal visible={editModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
            <View style={{height: '20%', width: '90%', backgroundColor: 'white', position: 'absolute', top: '25%', left: '5%', borderRadius: 15, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
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
                    <Text style={{alignSelf: 'center', marginTop: 20, marginBottom: 20}}>{modalTitle}</Text>

                    <View style={{backgroundColor: '#edf0f0', width: '100%', flexDirection: 'row', borderRadius: 10}}>

                    <InputField
                    inputStyle={{
                    fontSize: 14
                    }}
                    containerStyle={{
                    width: '90%',
                    paddingTop: 10,
                    zIndex: 600
                    }}
                    placeholder={modalTitle}
                    autoFocus={false}
                    autoCapitalize='words'
                    keyboardType= {keyboard}
                    textContentType='telephoneNumber'
                    value={modalInput}
                    onChangeText={text => {setModalInput(text) 
                    }}
                    secureTextEntry={false}
                    />

                    <TouchableOpacity style={{width: '10%', alignItems: 'center'}} onPress={()=>handleSubmit()}>
                        <Text style={{alignSelf: 'center', fontSize: 14, marginTop: 15}}>Ok</Text>
                    </TouchableOpacity>

                    </View>
                    {showErrorMessageBool ? <Text style={{color: 'red'}}>{errorMessageModal}</Text> : null}
                    
                    </View>
                <TouchableOpacity
                    style={{backgroundColor: 'white',
                    borderRadius: 10,
                    position: 'absolute',
                    margin: 10,
                    marginHorizontal: 5,
                    zIndex: 50,
                    marginTop: 10
                    }}
                    onPress={() => {
                        setEditModal(false)
                    }}>
                    <Text style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontSize: 15, padding: 5}}><MaterialCommunityIcons name="close" size={20} color='gray'/></Text>
                </TouchableOpacity>
            </View>
                
            </Modal>
            
            </View>
 
    </View>
    
  );
}
