import React, { useContext } from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, ImageBackground ,Alert, StatusBar, Dimensions} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {AuthContext} from '../../context-variable/context';
import UserAvatar from 'react-native-user-avatar';

export default function QrCode({route}) {


    const qrcodeUser = route.params;
    //const width = window.innerWidth();
    return (
        <View
            style={styles.container}
            accessible
            accessibilityLabel='main'
            testID='main'
        >
            <View style = {styles.qrcode}>
                <QRCode
                    value={route.params.value}
                    size={Dimensions.get('window').width* 5/6}
                />
            </View>
        </View>
        );

}
const styles = StyleSheet.create({
    container: { flex: 1,
    alignItems: "center",
    backgroundColor:"#29186d",
    justifyContent: "center"},
    qrcode: {
        backgroundColor: "#fff",
        borderRadius:20,
        padding:20,
        alignItems: 'center'
      },

});
