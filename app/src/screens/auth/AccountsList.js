import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Text , StatusBar, ImageBackground} from 'react-native';
import { RowAccount, Separator } from '../../components/RowAccount';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as theme from '../../shared/Theme';
import * as SQLite from 'expo-sqlite';
import {AuthContext} from '../../context-variable/context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
//import accounts from '../../testData/accounts'

var db = SQLite.openDatabase('database.db');
var actualize =  true ;
export function change(){
  actualize = (actualize?false:true);
}

export default function AccountsList({navigation}) {
  const [accounts, setAccounts] = useState([]);

  useFocusEffect(
    React.useCallback( () => {
      db.transaction(tx => {
        tx.executeSql("CREATE TABLE IF NOT EXISTS `Account` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `firstname` VARCHAR(120) DEFAULT '', `lastname` VARCHAR(120) DEFAULT '', `password_hash` VARCHAR(70) DEFAULT '', `auth_required` BOOLEAN DEFAULT '1', `seed` VARCHAR(120) DEFAULT '', `address0` VARCHAR(120) DEFAULT '',`rsa_pubkey` TEXT DEFAULT '', `rsa_privkey` TEXT DEFAULT '');");
      });
      updateAccounts();
      // Do something when the screen is focused

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  const updateAccounts = () => {
    db.transaction(tx => {
      tx.executeSql('select * from account;', [], (_, { rows }) =>
        setAccounts(rows._array)
      );
    });
  }

  return (
  <>
  <StatusBar backgroundColor={theme.colors.blue} barStyle="light-content" />
    <ImageBackground source={require('../../assets/logos/Logo_colored_resized.png')} 
                    style={styles.imgBackground}>
    <LinearGradient
        colors={["#09203f", "#537895"]}
        start={[0.1, 0.1]}
        style={styles.linearGradient}
    >
    <FlatList
      data={accounts}
      keyExtractor = {(item)=> item.firstname + item.lastname + Math.random().toString()}
      renderItem={({ item }) => {
        const name = `${item.firstname} ${item.lastname}`;
        return (
          <RowAccount
            username={name}
            title={name}
            subtitle={<Ionicons name="md-lock" size={16} color="black" />} // TODO: if auth required render a keylock icon
            onPress={() => {navigation.push('SignInScreen', { account: item }); } }
          />
        );
      }}
      contentContainerStyle={{ paddingVertical: 20 }}
    />
    </LinearGradient>
    </ImageBackground>

    <View  style={styles.bottomView}>
      <TouchableOpacity onPress={() => {navigation.push('AddAccount');}}>
        <Text style={styles.textStyle}><FontAwesome5 name="plus-circle" size={16} color="white" /> Ajouter un compte</Text>
      </TouchableOpacity>
    </View>
  </>
)};
const styles = StyleSheet.create({
  bottomView: {
    width: '100%',
    height: 70,
    backgroundColor: theme.colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  textStyle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: "bold",
  },
  linearGradient: {
    width: '100%',
    height: '100%',
    opacity: 0.95,
    justifyContent: 'center'
  },
  imgBackground: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  }
});
