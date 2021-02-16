import React, {useState, useEffect, useContext} from 'react';
import { FlatList , StatusBar, Text, StyleSheet} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { RowContact, Separator } from '../../components/RowContact';
import * as theme from '../../shared/Theme';
import {isKnown} from '../../backend/models'
//import contacts from '../../testData/contacts';

import {AuthContext} from '../../context-variable/context';
import * as SQLite from 'expo-sqlite';

var db = SQLite.openDatabase('database.db');
var actualize = true;
export function change() { 
  actualize= actualize?false:true;
}
export default function NewMessage({navigation}) {
  
  const {getUser} = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const accountId = getUser().id;

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql("CREATE TABLE IF NOT EXISTS `Contact` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `account_id` INT NOT NULL, `address` VARCHAR(120) DEFAULT '', `firstname` VARCHAR(120) DEFAULT '', `lastname` VARCHAR(120) DEFAULT '');");
    });
    updateContacts(accountId);    
  },[actualize]);

  const updateContacts = (account_id) => { 
    db.transaction(tx => {
      tx.executeSql(`SELECT id, firstname, lastname, address FROM Contact WHERE account_id = ${account_id}`, [], (_, { rows }) => {
          //Then we filter the handshaked contacts
        filterContacts(rows._array).then((contacts_validated) => {
           console.log("Liste contacts filtrés, il y a que ceux avec qui on a handshaked :", contacts_validated)
          setContacts(contacts_validated);
        }).catch(function(error) {
          console.log('There has been a problem with sql operation in filterContacts in NewMessage.js: ', error.message);
        });
      }); 
    });
  }

  async function filterContacts(contacts) {
    let contacts_validated = [];
    for (var i=0; i < contacts.length; i++) {
      var contact_i = contacts[i]
      let isHandshaked = await isKnown(accountId, contacts[i].address)
      if (isHandshaked) {
        contacts_validated.push(contact_i)
      }
      console.log("out for", contacts_validated)
      return contacts_validated;
    }
  }

  return (
    <>
      <StatusBar backgroundColor={theme.colors.blue} barStyle="light-content" />
        <Text style={styles.text}>Si vous venez d'ajouter un contact, attendez qu'il se soit connecté pour pouvoir lui envoyer un message.</Text>
        <FlatList
          backgroundColor={"#666d8b"}
          data={contacts}
          keyExtractor={item => {
            return (item.firstname + item.lastname + Math.random().toString())
          }}
          renderItem={({ item }) => {
            const name = `${item.firstname} ${item.lastname}`;

            return (
              <RowContact
                username={name}
                title={name}
                subtitle={item.email}
                onPress={() => {console.log("new conv created, here is the detail :", item); navigation.navigate('ConversationDetails', { conversation: item, isNewMessage: true })}}
              />
            );
          }}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={() => <Separator />}
          ListFooterComponent={() => <Separator />}
          contentContainerStyle={{ paddingVertical: 20 }}
          
        />
    </>
)};

const styles = StyleSheet.create({
  text: {
    backgroundColor: "#666d8b",
    color: "white",
    paddingHorizontal: 40,
    paddingVertical: 20,
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center', 
  },
});
