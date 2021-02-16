import React, { useState, useEffect, useContext } from 'react';
import { Text, View, Alert, Button, StyleSheet, ImageBackground } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { addContact } from '../../backend/models';
import { LinearGradient } from "expo-linear-gradient";

import {AuthContext} from '../../context-variable/context';
import {CameraPermission} from './CameraPermission';
import * as SQLite from 'expo-sqlite';
import { add } from 'react-native-reanimated';



export default function Qrcode ({navigation}){ 
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const {getUser} = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);



  //const handleBarCodeScanned = ({ type, data }) => {
  async function handleBarCodeScanned({ type, data }) {
    setScanned(true);
    /* USE one of the qrcode we shared on the group pif paf pouf ( recommanded)
    To test copy paste:
    {"firstname":"Paul", "lastname": "Frambot", "address": "QCQMTXFRNRUWLALMLWVAXTDEUNYIIG9YC9RNCGLGXNWVMKFBRVAWD9PLQHLVDRRXEUZVXYIBBFQQPZR9Y", "publicKey": "a publicKey"} in : https://www.the-qrcode-generator.com
    */
    var contact = JSON.parse(data);
    let firstname = contact.firstname;
    let lastname = contact.lastname;
    let address = contact.address;
    let publicKey = contact.publicKey;
    let accountId = getUser().id;
    /*
    await addContact(firstname, lastname, address, publicKey, accountId)
    .then(() => {console.log("A contact was added");navigation.goBack();})
    .catch(function(error) {
      console.log('There has been a problem with sql operation: ' + error);
      });
      
     */
    Alert.alert("Ajout de contact", `Voulez-vous ajouter ${firstname} ${lastname} à vos contacts?`,[{
      text: "Oui", onPress: async () => {
        await addContact(accountId, firstname, lastname, address, publicKey)
          .then(() => {console.log("A contact was added 2", accountId, firstname, lastname, address, publicKey); navigation.goBack();})
          .catch(function(error) {
            console.log('There has been a problem with sql operation in addContact in Qrcode.js: ' + error);
          });
        } 
      },
      { text: "Non"},
    ],
    { cancelable: false });

    // const PressSignOut = () => {Alert.alert("Déconnexion", "Étes-vous sûr(e) de vouloir vous déconnecter?", [
    //   { text: "Oui", onPress: () => {signOut()} },
    //   { text: "Non", style: "cancel"},
    // ],
    // { cancelable: false })} ;
    
   };
  

  if (hasPermission === null) {
    return(
      <CameraPermission text="Demande d'accès à la caméra."/>
    )
  }

  if (hasPermission === false) {
    return (
      <CameraPermission text='Accès à la caméra refusé, vous pouvez le changer dans vos paramètres.'/>
    )
  }

  return (
    <View style={{backgroundColor: '#28304b', flex: 1}}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{flex:1}}
      />
      {scanned && <Button title={'Cliquez-ici pour scanner à nouveau'} onPress={() => setScanned(false)} />}
    </View>
  );
}
