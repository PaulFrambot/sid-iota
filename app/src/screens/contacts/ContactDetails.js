import React , { useContext } from 'react';
import { Text , View , StyleSheet, TouchableOpacity, ScrollView, ImageBackground, Image, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserAvatar from 'react-native-user-avatar';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from "expo-linear-gradient";
import {deleteContact , getAddressFromName, deleteAllMessagesWithContact} from '../../backend/models';

export default ({ route, navigation }) => {


  //Get information of the chosen contact
  const contactInfo = route.params.contact;
  console.log(contactInfo)
  const firstname = contactInfo.firstname;
  const lastname = contactInfo.lastname;
  //const toConversations =() => {/*to implement*/};

  //Value for the QRCode
  const qrcodeUser = JSON.stringify({
    firstname: firstname,
    lastname: lastname,
    address: contactInfo.address,
    publicKey: contactInfo.rsa_pubkey,
  })

  /******************
   * DELETE CONTACT *
   ******************/
  const PressDeleteContact = () =>{Alert.alert("Supprimer", "Êtes-vous sûr(e) de vouloir supprimer ce contact? Les données du contact seront perdues", [
    { text: "Oui", onPress: () => {handleDeleteContact()}},
    { text: "Non", style: "cancel"},
  ],
  { cancelable: false })} ;

  async function handleDeleteContact() { //we need to delete every message with this contact first to avoid buggs
    let address = await getAddressFromName(firstname, lastname);
    deleteAllMessagesWithContact(address)
    .then(
      deleteContact(address)
      .then(//TODO delete crypto entries of the contact when it will be implemented
        navigation.goBack())
      .catch(function(error) {
        console.log('There has been a problem with sql operation in deleteContact in ContactDetail.js: ', error.message);
      })
    )
    .catch(function(error) {
      console.log('There has been a problem with sql operation in deleteAllMessagesWithContact ContactDetail.js: ', error.message);
    });
    deleteContact(address);

  }

  return (
    //Main container
    //<View style ={styles.main_container}>
    <ImageBackground source={require('../../assets/logos/Logo_colored_resized.png')} style={styles.img}>
      <LinearGradient
        colors={["#212a44", "#3778a7","#212a44"]}
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

        
        {/*<TouchableOpacity
            style={styles.goToMsg}
            onPress={toConversations} >
            <Ionicons name= "ios-chatbubbles" size={32} color={"#939fc5"}/>
            <Text style={{marginLeft: 10,color: "#939fc5"}} >Voir les messages</Text>
        </TouchableOpacity>*/}
      
        
        <TouchableOpacity  onPress={() => {navigation.push('QRCodeZoom', { value: qrcodeUser })}}>
          <View style={styles.qrcode}>
          <QRCode
            value={qrcodeUser}
            size={200}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.deleteContact}
            onPress={PressDeleteContact}
        >
          <Text style={{color: "#939fc5"}}>Supprimer le contact</Text>
        </TouchableOpacity>
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
    marginBottom: 15,
    fontSize: 20,
    color: 'white',
  },
  goToMsg: {
    width: 100,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: 15,
    marginTop: 15,
    marginBottom: 15,
  },
  qrcode: {
    backgroundColor: "#fff",
    borderRadius:20,
    padding:15,
    marginBottom: 17,
    alignItems: 'center'
  },
  deleteContact: {
    fontSize: 15,
    marginBottom: 15,
  },
  scrollView: {
    flex: 1,
  }
});
  