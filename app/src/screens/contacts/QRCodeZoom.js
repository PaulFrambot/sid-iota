import React from 'react';
import { StyleSheet, View, Dimensions} from 'react-native';
import QRCode from 'react-native-qrcode-svg';


export default function QrCode({route}) {

    const qrcodeUser = route.params;

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
    backgroundColor:"#212a44",
    justifyContent: "center"},
    qrcode: {
        backgroundColor: "#fff",
        borderRadius:20,
        padding:20,
        alignItems: 'center'
      },

});
