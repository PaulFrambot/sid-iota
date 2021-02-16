import * as React from 'react';
import { createStackNavigator, HeaderStyleInterpolators } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as theme from '../../shared/Theme';

//Contacts Tab
import ContactsList from '../contacts/ContactsList';
import ContactDetails from '../contacts/ContactDetails';

//QRCode zoom
import QRCodeZoom from '../contacts/QRCodeZoom';

import { Alert, Button, Text , TouchableHighlight, View} from 'react-native';
import Qrcode from '../contacts/Qrcode';

import { TransitionSpecs } from '@react-navigation/stack';

const ContactParentStack = createStackNavigator();
export default ContactParentScreen = () => (
<ContactParentStack.Navigator >
  <ContactParentStack.Screen name = "contacts" component = {ContactsStackScreen} options={{headerShown: false}}/>
  <ContactParentStack.Screen name = "qrcode"  component = {Qrcode} options= {{   
    headerTitle: 'Scannez le QRCode SID de vos amis',
    headerTitleStyle: {
              color: 'white',
              fontWeight: 'bold',
              fontSize: 15.5,
            },
    headerStyle: {
      backgroundColor: theme.colors.blue,
    },
    headerBackImage:() =>(<Ionicons name="ios-arrow-back" size={28} style={{marginLeft:20}} color="white" />),
    headerBackTitle: ' ',

    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
  
  }}/>
</ContactParentStack.Navigator>
);




const ContactsStack = createStackNavigator();
const ContactsStackScreen = ({navigation}) => (
  <ContactsStack.Navigator>
    <ContactsStack.Screen
      name="ContactsList"
      component={ContactsList}
      options={{
        headerTitle: 'Contacts',
        headerRight:() => (
          <TouchableHighlight style ={{marginRight:10, flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }}onPress= {() => {navigation.navigate("qrcode");}} >
            <View > 
            <Ionicons name="md-person-add" size={28} style={{marginLeft:20}} color="white" />
            </View>
          </TouchableHighlight>
         
        ),
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: theme.colors.blue,
        },
      }}
    />
    <ContactsStack.Screen
      name="ContactDetails"
      component={ContactDetails}
      options={({ route }) => {
        return {
          headerTitle: route.params.contact.firstname+' '+route.params.contact.lastname,
          headerTitleStyle: {
            color: 'white',
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: theme.colors.blue,
          },
          headerBackImage:() =>(<Ionicons name="ios-arrow-back" size={28} style={{marginLeft:20}} color="white" />),
          headerBackTitle: ' ',
        };
      }}
    />
    <ContactsStack.Screen
      name="QRCodeZoom"
      component={QRCodeZoom}
      options={{
        headerTitle: 'QRCode',
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: theme.colors.blue,
        },
        headerBackImage:() =>(<Ionicons name="ios-arrow-back" size={28} style={{marginLeft:20}} color="white" />),
        headerBackTitle: ' ',
      }}
      />
  </ContactsStack.Navigator>
);