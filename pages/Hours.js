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
import CachedImage from 'react-native-expo-cached-image'
import {Picker} from '@react-native-picker/picker';

const Stack = createStackNavigator();

export default function StoreHours({navigation}) {
  const authContext = useContext(AuthContext)
  const [preferences, setPreferences] = useState({});
  console.log("HOURS", authContext.storeHours);
  const [hoursTemp, setHoursTemp] = useState(authContext.storeHours)
  const [hoursTempArray, setHoursTempArray] = useState(Object.values(authContext.storeHours))
  const [weekdayArray, setWeekdayArray] = useState(Object.keys(authContext.storeHours))
  const [loadingState, setLoadingState] = useState(new Array(authContext.items.length).fill(false))

  const [editModal, setEditModal] = useState(false);
  const [selectedOpenHour, setSelectedOpenHour] = useState('1');
  const [selectedOpenMinute, setSelectedOpenMinute] = useState('00');
  const [selectedOpenAmPm, setSelectedOpenAmPm] = useState('am');
  const [selectedCloseHour, setSelectedCloseHour] = useState('1');
  const [selectedCloseMinute, setSelectedCloseMinute] = useState('00');
  const [selectedCloseAmPm, setSelectedCloseAmPm] = useState('am');

  const [day, setDay] = useState('');
  const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const minutes= ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  const amPm = ['am', 'pm'];
  const auth = Firebase.auth();

  return (
    <View style={{height: Dimensions.get("screen").height, width: '100%', marginTop: 'auto', backgroundColor: 'white', paddingVertical: 50}}>
        <View style={{width: '100%', alignSelf: 'center'}}>
            <View style={{flexDirection: 'row', marginHorizontal: 20}}>
            <TouchableOpacity onPress={()=>navigation.pop(1)}>
            <MaterialCommunityIcons name="arrow-left" size={25}/>
            </TouchableOpacity>
            <Text style={{fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginHorizontal: 10, paddingBottom: 10, marginTop: 3}}>Store hours</Text>
            </View>
            <ScrollView style={{height: '100%', width: '90%', alignSelf: 'center'}}>
                <View style={{flexDirection: 'row', marginTop: 20}}>
                    <Text style={{width: '30%', paddingVertical: 5, fontWeight: 'bold', fontSize: 15}}>Monday: </Text>

                    <TouchableOpacity style={{width: '70%', position: 'absolute', right: 0, textAlign: 'right', marginTop: 10, color: 'gray'}} onPress={()=>{setDay('Monday'); setEditModal(true)}}>
                    <Text style={{textAlign: 'right', color: 'gray'}}>Edit</Text>
                    </TouchableOpacity>
                </View>
                <Text style={{width: '95%', alignSelf: 'center'}}>{hoursTemp["Monday"]["open"]} - {hoursTemp["Monday"]["close"]}</Text>

                <View style={{flexDirection: 'row', marginTop: 20}}>
                    <Text style={{width: '30%', paddingVertical: 5, fontWeight: 'bold', fontSize: 15}}>Tuesday: </Text>
                    <TouchableOpacity style={{width: '70%', position: 'absolute', right: 0, textAlign: 'right', marginTop: 10, color: 'gray'}} onPress={()=>{setDay('Tuesday'); setEditModal(true)}}>
                    <Text style={{textAlign: 'right', color: 'gray'}}>Edit</Text>
                    </TouchableOpacity>

                </View>
                <Text style={{width: '95%', alignSelf: 'center'}}>{hoursTemp["Tuesday"]["open"]} - {hoursTemp["Tuesday"]["close"]}</Text>

                <View style={{flexDirection: 'row', marginTop: 20}}>
                    <Text style={{width: '30%', paddingVertical: 5, fontWeight: 'bold', fontSize: 15}}>Wednesday: </Text>
                    <TouchableOpacity style={{width: '70%', position: 'absolute', right: 0, textAlign: 'right', marginTop: 10, color: 'gray'}} onPress={()=>{setDay('Wednesday'); setEditModal(true)}}>
                    <Text style={{textAlign: 'right', color: 'gray'}}>Edit</Text>
                    </TouchableOpacity>

                </View>
                <Text style={{width: '95%', alignSelf: 'center'}}>{hoursTemp["Wednesday"]["open"]} - {hoursTemp["Wednesday"]["close"]}</Text>

                <View style={{flexDirection: 'row', marginTop: 20}}>
                    <Text style={{width: '30%', paddingVertical: 5, fontWeight: 'bold', fontSize: 15}}>Thursday: </Text>
                    <TouchableOpacity style={{width: '70%', position: 'absolute', right: 0, textAlign: 'right', marginTop: 10, color: 'gray'}} onPress={()=>{setDay('Thursday'); setEditModal(true)}}>
                    <Text style={{textAlign: 'right', color: 'gray'}}>Edit</Text>
                    </TouchableOpacity>

                </View>
                <Text style={{width: '95%', alignSelf: 'center'}}>{hoursTemp["Thursday"]["open"]} - {hoursTemp["Thursday"]["close"]}</Text>

                <View style={{flexDirection: 'row', marginTop: 20}}>
                    <Text style={{width: '30%', paddingVertical: 5, fontWeight: 'bold', fontSize: 15}}>Friday: </Text>
                    <TouchableOpacity style={{width: '70%', position: 'absolute', right: 0, textAlign: 'right', marginTop: 10, color: 'gray'}} onPress={()=>{setDay('Friday'); setEditModal(true)}}>
                    <Text style={{textAlign: 'right', color: 'gray'}}>Edit</Text>
                    </TouchableOpacity>

                </View>
                <Text style={{width: '95%', alignSelf: 'center'}}>{hoursTemp["Friday"]["open"]} - {hoursTemp["Friday"]["close"]}</Text>

                <View style={{flexDirection: 'row', marginTop: 20}}>
                    <Text style={{width: '30%', paddingVertical: 5, fontWeight: 'bold', fontSize: 15}}>Saturday: </Text>
                    <TouchableOpacity style={{width: '70%', position: 'absolute', right: 0, textAlign: 'right', marginTop: 10, color: 'gray'}} onPress={()=>{setDay('Saturday'); setEditModal(true)}}>
                    <Text style={{textAlign: 'right', color: 'gray'}}>Edit</Text>
                    </TouchableOpacity>

                </View>
                <Text style={{width: '95%', alignSelf: 'center'}}>{hoursTemp["Saturday"]["open"]} - {hoursTemp["Saturday"]["close"]}</Text>

                <View style={{flexDirection: 'row', marginTop: 20}}>
                    <Text style={{width: '30%', paddingVertical: 5, fontWeight: 'bold', fontSize: 15}}>Sunday: </Text>
                    <TouchableOpacity style={{width: '70%', position: 'absolute', right: 0, textAlign: 'right', marginTop: 10, color: 'gray'}} onPress={()=>{setDay('Sunday'); setEditModal(true)}}>
                    <Text style={{textAlign: 'right', color: 'gray'}}>Edit</Text>
                    </TouchableOpacity>

                </View>
                <Text style={{width: '95%', alignSelf: 'center'}}>{hoursTemp["Sunday"]["open"]} - {hoursTemp["Sunday"]["close"]}</Text>

                <TouchableOpacity style={{marginTop: 100, margin: 30, marginBottom: 10, backgroundColor: '#44bec6', padding: 7, paddingHorizontal: 10, borderRadius: 5, alignSelf: 'center'}} onPress={async ()=>{
                    Object.keys(hoursTemp).map(async (day, i)=>{
                        await Firebase.firestore().collection('restaurants').doc(authContext.storeData.restaurant_id).collection('operating hours').doc(day).set({
                            open: hoursTemp[day]["open"],
                            close: hoursTemp[day]["close"]
                        })
                    })
                    await authContext.setStoreHours(hoursTemp);
                    await new Promise(resolve => setTimeout(resolve, 500));
                    navigation.pop(1);
                    
                    }}>
                        <Text style={{color: 'white', alignSelf: 'center', fontWeight: 'bold'}}>Submit changes</Text>
                </TouchableOpacity>

            </ScrollView>

             {/* EDIT NAME MODAL */}
            <Modal visible={editModal} backgroundColor='transparent' transparent={true} style={{zIndex: 500, marginTop: 300}}>
            <View style={{height: 230, width: '90%', backgroundColor: 'white', position: 'absolute', top: '25%', left: '5%', borderRadius: 15, shadowColor: 'gray', shadowOffset: {width: 3, height: 3}, shadowRadius: 5, shadowOpacity: 0.6,}}>
                <View style={{backgroundColor: 'white',
                    borderRadius: 10,
                    position: 'absolute',
                    zIndex: 50,
                    marginTop: 5,
                    width: '100%',
                    alignSelf: 'center'
                    }}> 

                    <Text style={{alignSelf: 'center', marginTop: 20, fontWeight: 'bold'}}>Set {day} hours: </Text>

                    <View style={{flexDirection: 'row'}}>
                    <View style={{width: '50%'}}>
                    <Text style={{alignSelf: 'center', marginTop: 15, fontWeight: '500', color: 'gray'}}>Open</Text>
                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <Picker
                        selectedValue={selectedOpenHour}
                        style={{height: 20, padding: 0, fontSize: 10}}
                        itemStyle={{fontSize: 13, height: 100, width: 60, padding: 0}}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedOpenHour(itemValue)
                        }>

                        {hours.map((hour, i)=>{
                            return( <Picker.Item key={i} label={String(hour)} value={String(hour)} />)
                        })}
                    </Picker>

                    <Text style={{marginTop: 40}}>:</Text>

                    <Picker
                        selectedValue={selectedOpenMinute}
                        style={{height: 20, padding: 0, fontSize: 10}}
                        itemStyle={{fontSize: 13, height: 100, width: 60, padding: 0}}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedOpenMinute(itemValue)
                        }>

                        {minutes.map((minute, i)=>{
                            return( <Picker.Item key={i} label={String(minute)} value={String(minute)} />)
                        })}

                        
                    </Picker>

                    <Picker
                        selectedValue={selectedOpenAmPm}
                        style={{height: 20, padding: 0, fontSize: 10, marginLeft: -10}}
                        itemStyle={{fontSize: 13, height: 100, width: 60, padding: 0}}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedOpenAmPm(itemValue)
                        }>

                        {amPm.map((ap, i)=>{
                            return( <Picker.Item key={i} label={String(ap)} value={String(ap)} />)
                        })}

                        
                    </Picker>
                    </View>
                    </View>

                    <View style={{width: '50%'}}>
                    <Text style={{alignSelf: 'center', marginTop: 15, fontWeight: '500', color: 'gray'}}>Close</Text>
                    <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                    <Picker
                        selectedValue={selectedCloseHour}
                        style={{height: 20, padding: 0, fontSize: 10}}
                        itemStyle={{fontSize: 13, height: 100, width: 60, padding: 0}}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedCloseHour(itemValue)
                        }>

                        {hours.map((hour, i)=>{
                            return( <Picker.Item key={i} label={String(hour)} value={String(hour)} />)
                        })}
                    </Picker>

                    <Text style={{marginTop: 40}}>:</Text>

                    <Picker
                        selectedValue={selectedCloseMinute}
                        style={{height: 20, padding: 0, fontSize: 10}}
                        itemStyle={{fontSize: 13, height: 100, width: 60, padding: 0}}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedCloseMinute(itemValue)
                        }>

                        {minutes.map((minute, i)=>{
                            return( <Picker.Item key={i} label={String(minute)} value={String(minute)} />)
                        })}

                        
                    </Picker>

                    <Picker
                        selectedValue={selectedCloseAmPm}
                        style={{height: 20, padding: 0, fontSize: 10, marginLeft: -10}}
                        itemStyle={{fontSize: 13, height: 100, width: 60, padding: 0}}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedCloseAmPm(itemValue)
                        }>

                        {amPm.map((ap, i)=>{
                            return( <Picker.Item key={i} label={String(ap)} value={String(ap)} />)
                        })}

                        
                    </Picker>
                    </View>
                    </View>



                    </View>

                    <TouchableOpacity style={{alignSelf: 'center', marginTop: 50}} onPress={async ()=>{
            

                        const hoursTempTemp = hoursTemp;
                        hoursTempTemp[day]["open"]=String(selectedOpenHour)+':'+String(selectedOpenMinute)+' '+String(selectedOpenAmPm);
                        hoursTempTemp[day]["close"]=String(selectedCloseHour)+':'+String(selectedCloseMinute)+' '+String(selectedCloseAmPm);
                        const hoursArrayTemp = hoursTempArray.map((x)=>x);
                        const index = weekdayArray.indexOf(day);
                        hoursArrayTemp[index]["open"] = String(selectedOpenHour)+':'+String(selectedOpenMinute)+' '+String(selectedOpenAmPm);
                        hoursArrayTemp[index]["close"] = String(selectedCloseHour)+':'+String(selectedCloseMinute)+' '+String(selectedCloseAmPm);
                        setHoursTempArray(hoursArrayTemp);
                        setHoursTemp(hoursTempTemp);
                        setSelectedOpenHour('1');
                        setSelectedOpenMinute('00');
                        setSelectedOpenAmPm('am');
                        setSelectedCloseHour('1');
                        setSelectedCloseMinute('00');
                        setSelectedCloseAmPm('am');

                        setEditModal(false);
                        
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
                        setEditModal(false);
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
