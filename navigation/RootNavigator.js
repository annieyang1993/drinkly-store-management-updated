import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, ActivityIndicator } from 'react-native';

import {Firebase, db} from '../config/firebase';
import { AuthenticatedUserContext } from './AuthenticatedUserProvider';
import HomeStack from './HomeStack';
import LoginScreen from '../screens/LoginScreen';
import { useCardAnimation } from '@react-navigation/stack';

const auth = Firebase.auth();

export default function RootNavigator() {
  const { user, setUser, loggedIn, setLoggedIn } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    //onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = auth.onAuthStateChanged(async authenticatedUser => {
      try {
        // if (authenticatedUser === true){
        //     await setUser(authenticatedUser);
        //     //const type = await Firebase.firestore().collection('users').
        //     console.log(user);
        //     await setUser(null);
        // } else{
        //     await setUser(null);
        // }
        await (authenticatedUser ? setUser(authenticatedUser) : setUser(null));
        //onsole.log(authenticatedUser);
        //console.log(authenticatedUser.uid)
        const type = await Firebase.firestore().collection('users').doc(authenticatedUser.uid).get()
        console.log("TYPE", type)
        if (type.data().customer_type==='StoreManagement'){
            setLoggedIn(true);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    });

    //unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {loggedIn ? <HomeStack /> : <LoginScreen />}
    </NavigationContainer>
  );
}