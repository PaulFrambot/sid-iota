import * as React from 'react';
import { createStackNavigator, HeaderStyleInterpolators } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as theme from '../shared/Theme';
/**** Screens ****/
//Auth
import AccountsList from '../screens/auth/AccountsList';
import AddAccount from '../screens/auth/AddAccount';
import SignInScreen from '../screens/auth/SignInScreen';



const AuthStack = createStackNavigator();
export default AuthStackScreen = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen 
      name="AccountsList" 
      component={AccountsList} 
      options={{
        headerTitle: 'Choisissez votre compte',
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: theme.colors.blue,
        }, 
      }}
      />
    <AuthStack.Screen 
      name="AddAccount" 
      component={AddAccount} 
      options={{
        headerTitle: 'Ajouter un compte',
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
        headerBackImage:() =>(<Ionicons name="ios-arrow-back" size={28} style={{marginLeft:20}} color="white" />),
        headerBackTitle: ' ',
        headerStyle: {
          backgroundColor: theme.colors.blue,
        }, 
        /*headerLeft: (props) => (
          <BackButton
            {...props}
            onPress={() => {
              // Do something
            }}
          />
        ),*/
      }}
      />
    <AuthStack.Screen 
      name="SignInScreen" 
      component={SignInScreen} 
      options={{
        headerTitle: 'Se connecter',
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
        headerBackImage:() =>(<Ionicons name="ios-arrow-back" size={28} style={{marginLeft:20}} color="white" />),
        headerBackTitle: ' ',
        headerStyle: {
          backgroundColor: theme.colors.blue,
        }, 
      }}
      />
  </AuthStack.Navigator>
);
