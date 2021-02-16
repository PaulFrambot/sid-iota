import React, {useState, useEffect, useContext} from 'react';
import { FlatList , StatusBar, StyleSheet, ImageBackground, View, TextInput} from 'react-native';
import { SearchBar } from 'react-native-elements';
import { RowContact, Separator } from '../../components/RowContact';
import * as theme from '../../shared/Theme';
import { useFocusEffect } from '@react-navigation/native';
//import contacts from '../../testData/contacts';
import Loading from '../utilities/Loading';
import { LinearGradient } from "expo-linear-gradient";
import { getRSAPubKey } from "../../backend/models";
import { AuthContext } from '../../context-variable/context';
import * as SQLite from 'expo-sqlite';
//import { TextInput } from 'react-native-paper';
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from '@expo/vector-icons';

var db = SQLite.openDatabase('database.db');
var actualize = true;
export function change() {
  actualize= actualize?false:true;
}
export default function ContactsList({navigation}) {
  const {getUser} = React.useContext(AuthContext);
  const [IsLoading, setLoading] = React.useState(false) ;
  const [contacts, setContacts] = useState([]);

  useFocusEffect(
    React.useCallback( () => {
      setLoading(true);
      db.transaction(tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS `Contact` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `account_id` INT NOT NULL, `address` VARCHAR(120) DEFAULT '', `firstname` VARCHAR(120) DEFAULT '', `lastname` VARCHAR(120) DEFAULT '');");
      });
      updateContacts(getUser().id);
      setLoading(false);

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

 /* useEffect(() => {
    db.transaction(tx => {
      tx.executeSql("CREATE TABLE IF NOT EXISTS `Contact` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `account_id` INT NOT NULL, `address` VARCHAR(120) DEFAULT '', `firstname` VARCHAR(120) DEFAULT '', `lastname` VARCHAR(120) DEFAULT '');");
    });
    updateContacts(getUser().id);
  },[actualize]);*/

  const updateContacts = (account_id) => {
    db.transaction(tx => {
      tx.executeSql(`SELECT id, firstname, lastname, address FROM Contact WHERE account_id = ${account_id}`, [], (_, { rows }) => {
        let contacts_without_pub_key = rows._array
        addPubKeyToEachContact(contacts_without_pub_key).then( (contacts_pubkey) => {
          setContacts(contacts_pubkey);
        })
      });
    });
  }

  async function addPubKeyToEachContact(contacts_without_pub_key) {
    for (var i=0; i<contacts_without_pub_key.length; i++)  {
      let pubkey = await getRSAPubKey(contacts_without_pub_key[i].address, null);
      contacts_without_pub_key[i]["rsa_pubkey"] = pubkey;
    }
    return contacts_without_pub_key
  }

  /*const contacts1 = [{"firstname":"Paul", "lastname": "Frambot", "address": "QCQMTXFRNRUWLALMLWVAXTDEUNYIIG9YC9RNCGLGXNWVMKFBRVAWD9PLQHLVDRRXEUZVXYIBBFQQPZR9Y", "publicKey": "a publicKey"},
  {"firstname":"Frambote", "lastname": "Paule", "address": "QCQMTXFRNRUWLALMLWVAXTDEUNYIIG9YC9RNCGLGXNWVMKFBRVAWD9PLQHLVDRRXEUZVXYIBBFQQPZR9Y", "publicKey": "a publicKey"},
  {"firstname":"octave", "lastname": "LT", "address": "QCQMTXFRNRUWLALMLWVAXTDEUNYIIG9YC9RNCGLGXNWVMKFBRVAWD9PLQHLVDRRXEUZVXYIBBFQQPZR9Y", "publicKey": "a publicKey"}
  ];*/

  //Search text
  const [search, setSearch] = useState('');

  //Filter contacts by name (with search text)
  var filteredContacts = contacts.filter((item) => {
        return (item.firstname+item.lastname).indexOf(search) >=0;
  });

  return (
    IsLoading?( <Loading/>):
(
  <>
    <StatusBar backgroundColor={theme.colors.blue} barStyle="light-content" />
      <ImageBackground
        source={require('../../assets/logos/Logo_colored_resized.png')}
        style={styles.img}
        >
        <LinearGradient
            colors={["#212a44", "#3778a7","#212a44"]}
            start={[0.1, 0.1]}
            style={styles.linearGradient}
            >

          {/*Search Bar*/}
          <View style={styles.searchBarContainer}>
            <TextInput 
                placeholder=" Recherche l'un de tes contacts" 
                placeholderTextColor="black" 
                onChangeText={(val) => setSearch(val)}
                style={styles.searchBar}/>

            {/*<Ionicons style={styles.searchIcon} name="md-glass" size={20} color="#000">*/}
            <Entypo name="magnifying-glass" size={24} style={styles.searchIcon} />
          </View>

          <FlatList
            backgroundColor={"transparent"} //#666d8b
            data={filteredContacts}
            keyExtractor={(item) => 
              item.firstname + item.lastname + Math.random().toString()
            }
            renderItem={({ item }) => {
              const name = `${item.firstname} ${item.lastname}`;

              return (
                <RowContact
                  username={name}
                  title={name}
                  subtitle={item.email}
                  onPress={() => navigation.push('ContactDetails', { contact: item })}
                />
              );
            }}
            ItemSeparatorComponent={Separator}
            ListHeaderComponent={() => <Separator backgroundColor={'transparent'}/>}
            ListFooterComponent={() => <Separator backgroundColor={'transparent'}/>}
            contentContainerStyle={{ paddingVertical: 20 }}
          />
        </LinearGradient>
      </ImageBackground>
  </>


)
)};
const styles = StyleSheet.create(
  {
  searchBar: {
    flex: 1,
    paddingLeft: 10,
    borderBottomRightRadius: 20,
    height: 40,
    backgroundColor: '#8eabbd'
  },
  searchBarContainer: {
    flexDirection: 'row',
    paddingBottom: 10,
    alignItems: 'center'
  },
  searchIcon: {
    color: "#8eabbd",
    padding: 10,
  },
  linearGradient: {
    width: '100%',
    height: '100%',
    opacity: 0.95,
  },
  img: {
    flex: 1,
    width: "100%",
    alignItems: "center"
  }
});
