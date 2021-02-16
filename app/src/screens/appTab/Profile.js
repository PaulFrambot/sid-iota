import * as React from 'react';
import { createStackNavigator, HeaderStyleInterpolators } from '@react-navigation/stack';

import * as theme from '../../shared/Theme';

//Profile Tab
import MyProfile from '../profile/MyProfile';
import QrCode from '../profile/QRCode';
import ProfileDetail from '../profile/ProfileDetail'
import ConversationDetails from "../conversations/ConversationDetails";
import {Ionicons} from "@expo/vector-icons";




const ProfileStack = createStackNavigator();
export default ProfileStackScreen = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen
      name="Profil"
      component={MyProfile}
      options={{
        headerTitle: 'Profil',
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: theme.colors.purple,
        },
      }}
      />
      <ProfileStack.Screen
      name="QRCode"
      component={QrCode}
      options={{
        headerTitle: 'QRCode',
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: theme.colors.purple,
        },
        headerBackImage:() =>(<Ionicons name="ios-arrow-back" size={28} style={{marginLeft:20}} color="white" />),
        headerBackTitle: ' ',
      }}
      />
    {/* <ProfileStack.Screen name="Détail du profil" component={ProfileDetail} /> */}
  </ProfileStack.Navigator>
);
