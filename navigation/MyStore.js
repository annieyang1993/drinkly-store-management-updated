import React, {useContext} from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { ScrollView, Dimensions, TouchableOpacity, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { TouchableHighlight, Button, TextInput, Screen, Image, Platform} from 'react-native'
import {Firebase, db} from '../config/firebase';
import AuthContext from '../context/Context';
import StoreHome from '../pages/StoreHome'
import ContactInfo from '../pages/ContactInfo'
import StoreInfo from '../pages/StoreInfo'
import StorePhotos from '../pages/StorePhotos'
import Items from '../pages/Items'
import ItemModal from '../pages/ItemModal'
import AddPreference from '../pages/AddPreference'
import AddItem from '../pages/AddItem'
import AddExistingPreference from '../pages/AddExistingPreference'
import StoreHours from '../pages/Hours'

export default function HomeNavigation(){
    const Stack = createStackNavigator();
    const authContext = useContext(AuthContext);


    return(
        <View style={{height: Dimensions.get("screen").height, width: '100%'}}>
            <Stack.Navigator  screenOptions={{headerShown: false}}>
                <Stack.Screen  cardStyle='white' name="Store Home" options={{title: ""}} component={StoreHome} options={{headerShown: false}}/>
                <Stack.Screen  cardStyle='white' name="Contact Info" options={{title: ""}} component={ContactInfo} options={{headerShown: false}}/>
                <Stack.Screen  cardStyle='white' name="Store Info" options={{title: ""}} component={StoreInfo} options={{headerShown: false}}/>
                <Stack.Screen  cardStyle='white' name="Store Photos" options={{title: ""}} component={StorePhotos} options={{headerShown: false}}/>
                <Stack.Screen  cardStyle='white' name="Items" options={{title: ""}} component={Items} options={{headerShown: false}}/>
                <Stack.Screen cardStyle = 'white' name = 'Item Modal' options={{title: ""}} component={ItemModal} options={{headerShown: false, animationEnabled: false}}/>
                <Stack.Screen cardStyle='white' name = 'Add Preference' options={{title: ""}} component={AddPreference} options={{headerShown: false}}/>
                <Stack.Screen cardStyle='white' name = 'Add Item' options={{title: ""}} component={AddItem} options={{headerShown: false}}/>
                <Stack.Screen cardStyle='white' name = 'Add Existing Preference' options={{title: ""}} component={AddExistingPreference} options={{headerShown: false, animationEnabled: false}}/>
                <Stack.Screen cardStyle='white' name = 'Store Hours' options={{title: ""}} component={StoreHours} options={{headerShown: false}}/>

            </Stack.Navigator>
        </View>
    )
}