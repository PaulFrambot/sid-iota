
import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, View, Text, Platform, Button } from 'react-native'
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import * as theme from '../../shared/Theme';
import {AuthContext} from '../../context-variable/context';
import {sendMessageToTangle} from '../../backend/Tangle/tangleSenders';
import {storeMessage} from '../../backend/models';
import {Message} from '../../backend/messageConsts';
import { set } from 'react-native-reanimated';
import {getConversationHistoryWithAddress} from '../../backend/models'
// https://dev.to/amanhimself/chat-app-with-react-native-part-4-a-guide-to-create-chat-ui-screens-with-react-native-gifted-chat-j43

export default function ConversationDetail({navigation,route}) {
  // This variable will store all the messages displayed with the data structure of react-native-gifted-tchat
  const [messages, setMessages] = useState([]);

  /********************
   * GET CURRENT USER *
   ********************/

  const {getUser} = useContext(AuthContext);
  const currentUser = getUser();
  const [state,setState] = useState(true);
//   useEffect(() =>{
//     console.log("actualiseeeeerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
//     console.log(actualize);

//   }, [actualize[0]]
// )


  /***********************************
   * GET PARAMS FROM PREVIOUS ROUTES *
   ***********************************/

  //First, we get the param from previosu routes: if it is coming from newmessage then isNewMessage will be true
  const { isNewMessage } = route.params;
  var { conversation } = route.params;
  /* Here is the structure of the conversation object
  {'firstname' : '' , 'lastname' : '', 'messages' : '', 'timestamp' : '', address: ''}
  où messages =[{'id' :, 'received' :,'timestamp' : , 'type' : , 'content' : }] */
  const address = conversation.address;
  // console.log(address)

  if (isNewMessage) { //if new message, conversation doesn't have any messages: we need to add an empy "message" field
    conversation["messages"] = [];
  }


  React.useEffect(() => {
    const interval = setInterval(() => {
      setState(!state);
    }, 5000);
    // We create the two users object of the conversation
    console.log("######################################################################");
    console.log("conversation : *******************************************************");
    //console.log(conversation);
    //concole.log(conversation.firstname + conversation.lastname + Math.random().toString());
    var userWeSpeakTo = new Object({_id: 2, name: conversation.firstname + ' ' + conversation.lastname,});
    var currentUserTchat = new Object({_id: 1, name: currentUser.firstname + ' ' + currentUser.lastname,}); 

    // Now we have to transform the messages from the backend in the correct format to be used by gifted-tchat
    var messages_for_tchat = [];
    getConversationHistoryWithAddress(currentUser.id,conversation.address).then((messages_from_backend)=> {
    
    var n = messages_from_backend.length
    for (let i = n-1; i >=0; i--){
      let temp = new Object();
      temp["_id"] = i;
      temp["text"] = messages_from_backend[i].content;
      temp["createdAt"] = new Date(messages_from_backend[i].timestamp * 1000);
      if ( messages_from_backend[i].received){//The message is recieved
        temp["user"] = userWeSpeakTo;
      } 
    
      else { //The message is sent
        temp["user"] = currentUserTchat;
      } 

      messages_for_tchat.push(temp);
    }
    //console.log("messages for tchat", messages_for_tchat);

    setMessages(messages_for_tchat);}).catch(function(error) {
      console.log('There has been a problem with sql operation in ConversationDetails.js: ' + error);
    });
    return ()=>{
      clearInterval(interval);
    };
 }, [state]);


  /**************************
   * SEND MESSAGE FUNCTIONS *
   **************************/

  async function handleSend(newMessage = []) {
    //console.log("new message from handle send ",newMessage);
    console.log("disp evrything");
    await sendMessage(newMessage, address);
    //setState(!state)
    console.log("#############################");
    console.log(state);
    setMessages(GiftedChat.append(messages, newMessage));

  }

  async function sendMessage(newMessage, address) {
    //ADD TO DATABASE
    let timestamp = Math.floor((new Date()).getTime()/ 1000);
    console.log("******************sending timestamp in conversation details*****************");
    console.log(timestamp);
    console.log("*************************************************************");

   
    //console.log("after");
    //actualize[0]
    //console.log("chaaaaaaaaaaaaaaaaaaaaaaaaaaaaaange")
    //console.log(actualize);
            
    //ADD TO TANGLE
    await sendMessageToTangle(currentUser.id,address, newMessage.text, timestamp).then(() => {console.log("the message was sent to tangle 2"); })
    .catch(function(error) {
      console.log('There has been a problem with tangle sending message operation in ConversationDetails.js: ' + error);
    });
  }

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel='main'
      testID='main'
      >
    <GiftedChat
      messages={messages}
      onSend={newMessage => handleSend(newMessage[0])}
      renderSend={renderSend}
      renderBubble={renderBubble}
      placeholder='Tapez votre message ici...'
      user={{ _id: 1, name: currentUser.firstname+' '+currentUser.lastname,}}
      showUserAvatar
      scrollToBottom
    />
    </View>
  )
}


/**********************
    *** DESIGN ***
**********************/

/*********************
 * Send button style *
 *********************/
function renderSend(props) {
  return (
    <Send {...props}>
      <View style={styles.sendingContainer}>
        <IconButton icon='send-circle' size={32} color= {theme.colors.green} />
      </View>
    </Send>
  );
}

/************************
 * Message Bubble style *
 ************************/
function renderBubble(props) {
  return (
    // Step 3: return the component
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          // Here is the color change
          backgroundColor: theme.colors.green,
        }
      }}
      textStyle={{
        right: {
          color: '#fff'
        }
      }}
    />
  );
}


const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: { flex: 1 },
});