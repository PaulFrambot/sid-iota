import * as React from 'react';
import { Alert, Button, Text , TouchableHighlight, View} from 'react-native';
import { createStackNavigator, HeaderStyleInterpolators } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as theme from '../../shared/Theme';
import { Entypo } from '@expo/vector-icons'; 
//Conversations Tab
import ConversationsList from '../conversations/ConversationsList';
import ConversationDetails from '../conversations/ConversationDetails';
import NewMessage from '../conversations/NewMessage';

import { TransitionSpecs } from '@react-navigation/stack';


const ConversationParentStack = createStackNavigator();
export default ConversationParentScreen = () => (
<ConversationParentStack.Navigator >
  <ConversationParentStack.Screen name = "Conversations" component = {ConversationsStackScreen} options={{headerShown: false}}/>
  <ConversationParentStack.Screen name = "NewMessage"  component = {NewMessage} options= {{   
    headerTitle: 'Nouveau Message',
    headerTitleStyle: {
      color: 'white',
      fontWeight: 'bold',
    },
    headerStyle: {
      backgroundColor: theme.colors.green,
    },
    headerBackImage:() =>(<Ionicons name="ios-arrow-back" size={28} style={{marginLeft:20}} color="white" />),
    headerBackTitle: ' ',
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
  
  }}/>
</ConversationParentStack.Navigator>
);


const ConversationsStack = createStackNavigator();
const ConversationsStackScreen = ({navigation}) => (
  <ConversationsStack.Navigator>
    <ConversationsStack.Screen 
      name="ConversationsList" 
      component={ConversationsList}
      options={{
        headerTitle: 'Conversations',
        headerRight:() => (
          <TouchableHighlight style ={{marginRight:10, flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        }}onPress= {() => {navigation.navigate("NewMessage");}} >
            <View > 
            <Entypo name="new-message" size={24} color="white" />
            </View>
          </TouchableHighlight>
         
        ),
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
        headerStyle: {
          backgroundColor: theme.colors.green,
        },
      }}
    />
    <ConversationsStack.Screen 
      name="ConversationDetails" 
      component={ConversationDetails} 
      options={({ route }) => {
        return {
          headerTitle: `${route.params.conversation.firstname} ${route.params.conversation.lastname}`,
          headerTitleStyle: {
            color: 'white',
            fontWeight: 'bold',
          },
          headerStyle: {
            backgroundColor: theme.colors.green,
          },
          headerBackImage:() =>(<Ionicons name="ios-arrow-back" size={28} style={{marginLeft:20}} color="white" />),
          headerBackTitle: ' ',
        };
      }}
    />
  </ConversationsStack.Navigator>
);