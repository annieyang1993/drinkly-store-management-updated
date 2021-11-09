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
import Routes from '../navigation';

const Stack = createStackNavigator();

export default function ContactInfo({navigation}) {
  const authContext = useContext(AuthContext)
  const [description, setDescription] = useState(authContext.storeData.description);
  const [price, setPrice] = useState(authContext.storeData.price_level);
  const [sections, setSections] = useState(authContext.storeData.sections);
  const [editModal, setEditModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [keyboard, setKeyboard] = useState('default');
  const [modalInput, setModalInput] = useState('');
  const [errorMessageModal, setErrorMessageModal] = useState('');
  const [showErrorMessageBool, setShowErrorMessageBool] = useState(false);
  const [addSectionModal, setAddSectionModal] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0)
  const [editSectionModal, setEditSectionModal] = useState(false);
  const auth = Firebase.auth();

    useEffect(()=>{
        Geocoder.init("AIzaSyB9fx4NpEW1D65AvgJjzY-npVoFUf17FRg");
    }, [])

  const handleSubmitPage = async () =>{
      await Firebase.firestore().collection('restaurants').doc(`${authContext.storeData.restaurant_id}`).set({
          description: description,
          price_level: price
      }, {merge: true})

      authContext.storeData.sections.map(async (section,i)=>{
         if (section!==sections[i]){
             authContext.items.map(async (item, j)=>{
                 if (item["section"]===section){
                     await Firebase.firestore().collection('restaurants').doc(`${authContext.storeData.restaurant_id}`).collection('items').doc(item["name"]).set({
                         section: sections[i]
                     }, {merge: true})
                 }
             })
         }
      })

      await Firebase.firestore().collection('restaurants').doc(`${authContext.storeData.restaurant_id}`).set({
          sections: sections
      }, {merge: true});

      authContext.getStore();
      navigation.pop(1)
  }

  const handleSubmit = async () =>{
      if (modalTitle==='Description (max 250 characters)'){
          await setDescription(modalInput);
          setModalInput('');
          setEditModal(false);
      
      }
  }

  const handleSubmitSection = async () =>{
      if (modalInput.length>0){
          const sectionsTemp = sections.map((x)=>x);
          sectionsTemp[sectionIndex] = modalInput;
          await setSections(sectionsTemp);
          setModalTitle('');
          setModalInput('');
          setEditSectionModal(false)

      }
  }

  return (
    <View style={{height: Dimensions.get("screen").height, width: '100%', marginTop: 'auto', backgroundColor: 'white', paddingVertical: 50}}>
            <View style={{width: '100%', alignSelf: 'center'}}>
            <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            <TouchableOpacity onPress={()=>navigation.pop(1)}>
            <MaterialCommunityIcons name="arrow-left" size={25}/>
            </TouchableOpacity>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginHorizontal: 10, paddingBottom: 10, marginTop: 3}}>Store Info</Text>
            </View>
            <ScrollView style={{width: '92%', alignSelf: 'center', height: '100%'}}>
                <View style={{flexDirection: 'row', width: '100%'}}>
                <Text style={{marginTop: 10, marginBottom: 10, width: '50%'}}>Description</Text>
                <TouchableOpacity style={{width: '20%', textAlign: 'right', alignSelf: 'flex-end', alignItems: 'flex-end', width: '50%'}} onPress={async ()=>{
                    //await setStateType(street);
                    //await setStateFunction(setStreet());
                    await setModalTitle('Description (max 250 characters)');
                    await setKeyboard('default');
                    await setModalInput(description);
                    setEditModal(true)}}>
                <Text style={{textAlign: 'right', color: 'gray', marginTop: 10, marginBottom: 10}}>Edit</Text>
                </TouchableOpacity>

                </View>
                <View style={{backgroundColor: '#edf0f0', width: '100%', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, alignSelf: 'center', flexDirection: 'row'}}>

                <Text style={{height: 90,
                    width: '100%',
                    textAlign: 'left',
                    padding: 0,
                    paddingVertical: 10,
                    flexWrap: 'wrap',
                    alignItems: 'flex-start'}} numberOfLines={3}>{description}</Text>
                
                </View>


                <View style={{flexDirection: 'row', width: '100%'}}>
                <Text style={{marginTop: 10, marginBottom: 10, width: '50%'}}>Price Level</Text>

                </View>
                <View style={{width: '100%', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, alignSelf: 'center', flexDirection: 'row'}}>

                {[0,1,2,3].map((button, i)=>{
                    return(
                        <View key={i} style={{marginLeft: '9%'}}>
                            <View style={{flexDirection: 'row'}}>
                                {new Array(i+1).fill(false).map((num, j)=>{
                                    return(<Text key={j}>$</Text>)
                                })}
                                {i===price-1 ? <View key={i} style={{height: 20, width: 20, borderRadius: 10, borderWidth: 1, borderColor: 'black', marginLeft: 5}}>
                                    <View style={{height: 14, width: 14, backgroundColor: 'black', borderRadius: 7, alignSelf: 'center', marginTop: 2}}></View>
                                </View>: 
                                <TouchableOpacity onPress={()=>setPrice(i+1)}>
                                <View key={i} style={{height: 20, width: 20, borderRadius: 10, borderWidth: 1, borderColor: 'black', marginLeft: 5}}>

                                </View>
                                </TouchableOpacity>}
                            </View>
                            

                        </View>
                    )
                })}
                
                </View>

                <View style={{flexDirection: 'row', width: '100%'}}>
                    <Text style={{marginTop: 10, marginBottom: 10, width: '50%'}}>Sections</Text>

                    </View>
                    <View style={{width: '100%', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, alignSelf: 'center'}}>

                    {sections.map((section, i)=>{
                        return(<View key={i} style={{height: 30, flexDirection: 'row'}}>
                            <Text >{i+1}. {section}</Text>
                            <TouchableOpacity style={{position: 'absolute', right: 0}} onPress={()=>{setEditSectionModal(true); setSectionIndex(i); setModalInput(sections[i]);}}>
                                <Text style={{color: 'gray'}}>Edit</Text>
                            </TouchableOpacity>
                        </View>)
                    })}
                
                </View>
                <Text style={{marginTop: 5, fontSize: 13, color: 'gray', fontStyle: 'italic', marginBottom: 10}}>* New sections can be added when creating a menu item.</Text>

                <TouchableOpacity style={{margin: 50, alignSelf: 'center', marginTop: 150}} onPress={()=>{handleSubmitPage()}}>
                <Text >Submit</Text>
                </TouchableOpacity>

            </ScrollView>

            <Modal visible={editSectionModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
            <View style={{height: 170, width: '90%', backgroundColor: 'white', position: 'absolute', top: '25%', left: '5%', borderRadius: 15, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
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
                    <Text style={{alignSelf: 'center', marginTop: 20, marginBottom: 20}}>Edit Section</Text>

                    <View style={{backgroundColor: '#edf0f0', width: '100%', flexDirection: 'row', padding: 3, borderRadius: 10, height: 35}}>

                    <InputField
                    inputStyle={{
                    fontSize: 14,
                    }}
                    containerStyle={{
                    width: '90%',
                    paddingVertical: 0,
                    paddingHorizontal: 5,
                    zIndex: 600,
                    height: 25
                    }}
                    placeholder={modalTitle}
                    autoFocus={false}
                    autoCapitalize='sentences'
                    keyboardType= {keyboard}
                    textContentType='telephoneNumber'
                    value={modalInput}
                    maxLength={40}
                    onChangeText={text => {setModalInput(text) 
                    }}
                    secureTextEntry={false}
                    />

                    </View>
                    {showErrorMessageBool ? <Text style={{color: 'red'}}>{errorMessageModal}</Text> : null}
                    <TouchableOpacity style={{width: '10%', alignItems: 'center', paddingVertical: 10, alignSelf: 'center'}} onPress={()=>handleSubmitSection()}>
                        <Text style={{alignSelf: 'center'}}>Ok</Text>
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
                        setEditSectionModal(false);
                    }}>
                    <Text style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontSize: 15, padding: 5}}><MaterialCommunityIcons name="close" size={20} color='gray'/></Text>
                </TouchableOpacity>
            </View>
                
            </Modal>

            <Modal visible={editModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
            <View style={{height: 270, width: '90%', backgroundColor: 'white', position: 'absolute', top: '25%', left: '5%', borderRadius: 15, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
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

                    <View style={{backgroundColor: '#edf0f0', width: '100%', flexDirection: 'row', padding: 3, borderRadius: 10}}>

                    <InputField
                    inputStyle={{
                    fontSize: 14
                    }}
                    containerStyle={{
                    width: '90%',
                    height: 140,
                    padding: 0,
                    paddingHorizontal: 5,
                    zIndex: 600,

                    }}
                    placeholder={modalTitle}
                    autoFocus={false}
                    autoCapitalize='sentences'
                    keyboardType= {keyboard}
                    textContentType='telephoneNumber'
                    value={modalInput}
                    maxLength={250}
                    onChangeText={text => {setModalInput(text) 
                    
                    
                    }}
                    secureTextEntry={false}
                    />

                    </View>
                    {showErrorMessageBool ? <Text style={{color: 'red'}}>{errorMessageModal}</Text> : null}
                    <TouchableOpacity style={{width: '10%', alignItems: 'center', paddingVertical: 10, alignSelf: 'center'}} onPress={()=>handleSubmit()}>
                        <Text style={{alignSelf: 'center'}}>Ok</Text>
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
