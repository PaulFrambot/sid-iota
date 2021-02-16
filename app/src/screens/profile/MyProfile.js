import React, { useContext, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, ImageBackground, Alert, StatusBar,Share, Button} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {AuthContext} from '../../context-variable/context';
import UserAvatar from 'react-native-user-avatar';
import * as theme from '../../shared/Theme';
import { LinearGradient } from "expo-linear-gradient";
import Modal from "react-native-modal";
import { test, deleteAccount, getAllContacts, deleteAllMessagesWithContact, deleteContact } from '../../backend/models';

export default function MyProfile({navigation}) {
  const {signOut, suppressAccount, getUser} = React.useContext(AuthContext);
  const profil = getUser()

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  var firstname = profil.firstname;
  var lastname = profil.lastname;
  var address = profil.address0;
  var publicKey = profil.rsa_pubkey;

  var qrcodeUser = JSON.stringify({
    firstname: firstname,
    lastname: lastname,
    address: address,
    publicKey: publicKey,
  })

  /************
   * SIGN OUT *
   ************/

  const PressSignOut = () => {Alert.alert("Déconnexion", "Étes-vous sûr(e) de vouloir vous déconnecter?", [
    { text: "Oui", onPress: () => {signOut()} },
    { text: "Non", style: "cancel"},
  ],
  { cancelable: false })} ;

  /******************
   * DELETE ACCOUNT * TODO : delete entries of crypto when implemented
   ******************/
  async function suppressAccountAndItsData() {
    var contacts = await getAllContacts(profil.id)
    console.log("contacts a supprimer",contacts)
    for (var i = 0; i < contacts.length; i++) {
      console.log("in for loop");

      deleteAllMessagesWithContact(contacts[i].address)
      .then(
        deleteContact(contacts[i].address)
        .then(
           console.log("successfully deleted contact:", contacts[i])
        )
        .catch(function(error) {
          console.log('There has been a problem with sql operation in delete contact in MyProfile.js: ' + error);
        })
      )
      .catch(function(error) {
        console.log('There has been a problem with sql operation in deleteAllMessagesWithContact in MyProfile.js: ' + error);
      });

    }
    await deleteAccount(profil.id)

  }

  const PressDeleteAccount = () =>{Alert.alert("Supprimer", "Êtes-vous sûr(e) de vouloir supprimer ce compte? Vos données seront perdues", [
    { text: "Oui", onPress: async () => {
      suppressAccountAndItsData()
      .then(signOut())
      .catch(function(error) {
        console.log('There has been a problem with sql operation in suppressAccountAndItsData in MyProfile.js: ' + error);
      });
    }},
    {
      text: "Non",
      style: "cancel"
    },
  ],
  { cancelable: false })} ;
  /******************
   * Confidentiality Politic *
   ******************/
  const PressCGU = () =>{Alert.alert("Politique d'utilisation", "Mr RGPD ne va pas nous embéter : tes données restent à toi tkt bro", [
        { text: "OK"},
      ],
      { cancelable: false })} ;
  /******************
   * Share*
   ******************/
      const onShare = async () => {
        try {
          var Link = 'https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=' + qrcodeUser;
          Link =Link.toString()
          const result = await Share.share({
            message: Link ,
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
      };

  return (

    <ImageBackground source={require('../../assets/logos/Logo_colored_resized.png')} style={styles.img}>
      <LinearGradient
        colors={["#29186d", "#644ba9","#29186d"]}
        start={[0.1, 0.1]}
        style={styles.linearGradient}
      >

      <ScrollView style={styles.scrollView}>
      <View style={styles.container}>

        <View>
          <UserAvatar size = {90} name = {firstname+" "+lastname} />
        </View>

        <Text style={styles.firstName}> {firstname} </Text>
        <Text style={styles.lastName}> {lastname} </Text>

        <TouchableOpacity  onPress={() => {navigation.push('QRCode', { value: qrcodeUser  })}}>
          <View style={styles.qrcode}>
          <QRCode
            value={qrcodeUser}
            size={200}
            />
            </View>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.deleteAccount}
            onPress={onShare}
        >
          <Text style={{color: "#939fc5"}}>Partager</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.deleteAccount}
            onPress={toggleModal}
        >
          <Text style={{color: "#939fc5"}}>Où sont vos données ?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signOut}
          onPress={PressSignOut}
          >
          <Text style={{color: "#939fc5"}}>Se déconnecter</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteAccount}
          onPress={PressDeleteAccount}
          >
          <Text style={{color: "#939fc5"}}>Supprimer le compte</Text>
        </TouchableOpacity>
        <Modal isVisible={isModalVisible}>
          <ScrollView style={styles.modal}>
            <Text style={styles.modalTitle}>Où vont vos données ?</Text>
            <Text style={styles.modalText}>S.I.D. App est une application de messagerie décentralisée utilisant
              la Tangle pour communiquer avec les différents utilisateurs. Nous ne stockons et n'utilisons aucune vos données.
              Les données sensibles de chiffrement de vos comptes sont uniquement conservées sur votre téléphone
              et vos messages sont chiffrés avant d'être inscrits sur la Tangle. L'application est entièrement gratuite
              et sans publicité, ce qui est rendu possible grâce à l'utilisation du réseau décentralisé Tangle. En
              revanche si vous souhaitez nous soutenir dans le développement de cette application, vous pouvez nous
              faire un don en envoyant des IOTAs à l'adresse suivant : MVCAMQYZDEGUVPGXT9DCXPHFDXBXBIMTHPIPHWCZCZMNTHSYCRHFBVVUOHTUCBFHOXMNKFAFKNPCPVCBXAPFBXGMKY
            </Text>
            <Text style={styles.modalTextBold}>
              Conformité RGPD :
            </Text>
            <Text style={styles.modalText}>
              Le règlement européen n° 2016/679 stipule :
              « Le droit à l’information, le droit d’accès et le droit à la portabilité ne posent a priori pas
              de difficultés particulières liées à la technologie Blockchain. Comme pour la minimisation des risques,
              le choix du format de stockage de la donnée via un procédé cryptographique permet de se rapprocher d’un
              exercice des droits effectif pour la personne concernée : la suppression des données stockées en dehors
              de la Blockchain et des éléments permettant la vérification permet de couper l’accessibilité à la preuve
              enregistrée sur la Blockchain, en la rendant difficile voire impossible à recouvrer ; une prise en
              considération des droits au programme en amont de la mise en œuvre d’un smart contract permet de faire
              droit à une demande de limitation du traitement ou d’intervention humaine. L’équivalence de ces
              solutions avec les exigences résultant du RGPD, notamment en ce qui concerne la limitation de durée
              de conservation et le droit à l’effacement, suppose une évaluation approfondie. »
            </Text>
            <Button style={styles.modalOK} title="OK" color={"#29186d"} onPress={toggleModal} />
            <Text style={styles.modalText}></Text>
          </ScrollView>
        </Modal>
      </View>
      </ScrollView>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'space-between'
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
  },
  firstName: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: "bold",
    color: 'white'
  },
  lastName: {
    fontSize: 20,
    color: 'white',
  },
  qrcode: {
    backgroundColor: "#fff",
    borderRadius:20,
    padding:15,
    marginTop: 17,
    marginBottom: 17,
    alignItems: 'center'
  },
  deleteAccount: {
    fontSize: 15,
    marginBottom: 15,
  },
  signOut: {
    fontSize: 15,
    marginBottom: 11
  },
  scrollView: {
    flex: 1,
  },
  modal:{
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding:14,
    paddingBottom: 40,
    margin: 20,
    marginTop: 30,
  },
  modalTitle:{
    fontSize:16,
    textAlign: 'center',
    fontWeight: 'bold',
    color:'#29186d',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  modalTextBold:{
    textAlign: 'center',
    paddingTop: 12,
    fontSize: 15,
    fontWeight: "bold",
  },
  modalOK:{
    padding: 20,
  },
  modalText:{
    textAlign: 'justify',
    paddingTop: 6
  }
});
