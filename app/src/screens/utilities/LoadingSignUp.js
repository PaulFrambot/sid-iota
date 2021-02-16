//TODO : personalise: gif?
import React from 'react';
import {View, Text, StyleSheet, Alert, TextInput} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import * as theme from '../../shared/Theme';

export default () => (
<View style = {styles.container}>
    <ActivityIndicator animating={true} color={theme.colors.blue} size = "large" />
    <Text style={styles.headtext}>Veuillez patienter</Text>
    <Text style={styles.text}>Nous générons vos clés de sécurité et chiffrons votre mot de passe ...</Text>
</View>
);

const styles = StyleSheet.create({
    container:{
        flex :1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headtext:{
        paddingTop: 35,
        paddingHorizontal: 40, 
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center', 
        color: theme.colors.blue,
    },
    text:{
        paddingTop: 20,
        paddingHorizontal: 40, 
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center', 
        color: theme.colors.blue,
    }
});
