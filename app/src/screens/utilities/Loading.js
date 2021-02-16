//TODO : personalise: gif?
import React from 'react';
import {View, Text, StyleSheet, Alert, TextInput} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default () => (<View style = {styles.container}><ActivityIndicator size = "large" /></View>
    //<Text style = {styles.container}>Loading </Text> );

);

const styles = StyleSheet.create({
container:{
    flex :1,
    justifyContent:'center',
    alignItems :  'center',

}});
