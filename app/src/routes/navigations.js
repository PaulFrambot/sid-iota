import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import AsyncStorage from '@react-native-community/async-storage';
import * as theme from '../shared/Theme';
/**** Backend *****/
import { createAccount, deleteAccount } from '../backend/models';

/**** Context *****/
import {AuthContext} from '../context-variable/context';

/**** Screens ****/
import AuthStackScreen from './AuthScreen';
import AppTabsScreen from './AppTab'; 
import Loading from '../screens/utilities/Loading';
import LoadingSignUp from '../screens/utilities/LoadingSignUp';

import intervalId from '../backend/Tangle/Interval';

currentUserState = null

export default () => {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            isSignedIn : true,
            isLoading:false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
            isLoading:false,
            isSignedIn:false,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      isSignedIn: false,
      userToken: null,
    },
  );
  
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);



  async function setCurrentUserState(data)
  {
    futureState = new Object(currentUserState); 
    newState = new Object(data);
    Object.assign(futureState, newState);
    await (currentUserState = futureState);
  }


  const authContext = React.useMemo(
    () => ({
      signIn: async () => { //peut etre mettre user en argument, si jamais on veut utiliser ses props pour faire un token
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        
        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => {clearInterval(intervalId[0]); dispatch({ type: 'SIGN_OUT' }); currentUserState = null;},
      signUp: async (firstname, lastname, password, auth_required) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        setIsLoading(true);
        setKeyGening(true)
        await createAccount(firstname, lastname, password, auth_required);
        dispatch({ type: 'SIGN_OUT' /*type: 'SIGN_IN', token: 'dummy-auth-token' */});
        setKeyGening(false)
        setIsLoading(false);
      },

      getUser: () => {//return User data which are set by setUser function
        return (currentUserState);
      },
      
      setUser:  (data) => { 
        setCurrentUserState(data);
      },

      suppressAccount: async () => {
        console.log(intervalId);
        clearInterval(intervalId[0]);
        await deleteAccount(currentUserState.id);
        dispatch({ type: 'SIGN_OUT' });
      },

      loading: () => {setIsLoading(!isLoading);},
      keyGening: () => {setKeyGening(!keyGening);},

    }),
    []
  );

  const [isLoading, setIsLoading] = React.useState(false); //temporary put to false
  const [keyGening, setKeyGening] = React.useState(false);
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        { 
        isLoading ? ( keyGening ? (<LoadingSignUp />) : (<Loading />))
        : (state.isSignedIn ? (
          <AppTabsScreen />
        ) : (
          <AuthStackScreen />
        ))}
        
      </NavigationContainer>
    </AuthContext.Provider>
  );
};