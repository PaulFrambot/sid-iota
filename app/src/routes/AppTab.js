import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import * as theme from '../shared/Theme';

import ConversationParentStack from '../screens/appTab/Conversation';
import ContactParentScreen from '../screens/appTab/Contact';
import ProfileStackScreen from '../screens/appTab/Profile';




const AppTabs = createMaterialBottomTabNavigator();
export default AppTabsScreen = () => (
  <AppTabs.Navigator
    initialRouteName="Conversations"
    activeColor="white"
    //Enable dynamicity
    shifting={true}
    animationEnabled= {true}
    >
    <AppTabs.Screen
      name="Conversations"
      component={ConversationParentStack}
      options={{
        tabBarLabel: 'Conversations',
        tabBarColor: theme.colors.green,
        tabBarIcon: ({ color }) => (
          <Ionicons name="ios-chatbubbles" color={color} size={26} />
        ),
      }}
    />
    <AppTabs.Screen
      name="Contacts"
      component={ContactParentScreen}
      options={ {
        tabBarLabel: 'Contacts',
        tabBarColor: theme.colors.blue,
        tabBarIcon: ({ color }) => (
          <Ionicons name="ios-contacts" color={color} size={26} />
        ),
      }}
    />
    <AppTabs.Screen
      name="Profil"
      component={ProfileStackScreen}
      options={{
        tabBarLabel: 'Profil',
        tabBarColor: theme.colors.purple,
        tabBarIcon: ({ color }) => (
          <Feather name="user" color={color} size={26}/>
        ),
      }}
    />
  </AppTabs.Navigator>
);