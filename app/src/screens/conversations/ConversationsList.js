import React, {useContext, useState, useEffect, useCallback} from 'react';
import {FlatList, ImageBackground, StatusBar, StyleSheet, View} from 'react-native';
import * as theme from '../../shared/Theme';
import { RowConversation, Separator } from '../../components/RowConversation';
import {getConversations} from '../../backend/models';
import Loading from '../utilities/Loading';
//import conversations from '../../testData/conversations';
import { LinearGradient } from "expo-linear-gradient";

import {AuthContext} from '../../context-variable/context';
import * as SQLite from 'expo-sqlite';
import { useFocusEffect } from '@react-navigation/native';

var db = SQLite.openDatabase('database.db');


export default function ConversationsList({navigation}) {

  /*********************
  SQL code not finished
  *********************/
  const {getUser} = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  //Structure de conversations: [ {'firstname' : '' , 'lastname' : '', 'messages' : '', 'timestamp' : '', address: ''}, ...] où messages ={'id' :, 'received' :, 'timestamp' :, 'type' : ,'content' : } 
  
  const [isLoading, setLoading] = useState(false);

  useFocusEffect(
    useCallback( () => {
      setLoading(true);
      db.transaction(tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS `Message` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `account_id` INT NOT NULL, `timestamp` INT, `otherAddress` VARCHAR(120) DEFAULT '', `received` BOOLEAN DEFAULT '0', `type` INT, `content` TEXT);");
      });
      updateConversations(getUser().id);
      setLoading(false);

      // Do something when the screen is focused

      return () => {
        // Do something when the screen is unfocused i.e. when we are another screen
        // Useful for cleanup functions
      };
    }, [])
  );
  

  const updateConversations = (account_id) => {
    getConversations(account_id)
    .then((convs) => setConversations(convs))
    .catch(function(error) {
      console.log('There has been a problem with sql operation in ConversationsList.js: ', error);
    });
  }

  return (
    isLoading? (<Loading/> ):
    (<>
        <ImageBackground 
          source={require('../../assets/logos/Logo_colored_resized.png')} 
          size={0.1}
          resizeMode={'cover'}
          style={styles.img}>

            
          <LinearGradient
            colors={["#01726f", "#005b87","#01726f"]}
            start={[0.1, 0.1]}
            style={styles.linearGradient}
          >

          <FlatList
            style={styles.list}
            backgroundColor={"transparent"}
            data={conversations}
            keyExtractor={item => {
            return (item.firstname + item.lastname + Math.random().toString());
            }}
            renderItem={({ item }) => {
              const name = `${item.firstname} ${item.lastname}`;
              const subtitle = `${item.messages[item.messages.length-1].content.slice(0,30)}`;
              return (

                <RowConversation
                  username={name}
                  title={name}
                  subtitle={subtitle} 
                  onPress={() => navigation.push('ConversationDetails', { conversation: item, isNewMessage: false })}
                />
              );
            }}
            ItemSeparatorComponent={Separator}
            ListHeaderComponent={() => <Separator />}
            ListFooterComponent={() => <Separator />}
            contentContainerStyle={{ paddingVertical: 20 }}
          />

        </LinearGradient>

      </ImageBackground>
    </>)
)};

const styles = StyleSheet.create({
  linearGradient: {
    width: '100%',
    height: '100%',
    opacity: 0.95,
  },
  img: {
    flex: 1,
    alignItems: "center",

  },
  list: {
    flex: 1,
    width: "100%",
  }
});
