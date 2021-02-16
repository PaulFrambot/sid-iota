import React from "react";
import { View, Text, StyleSheet, ImageBackground} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export const CameraPermission = ({text}) => (
    <ImageBackground source={require('../../assets/logos/Logo_colored_resized_bottom.png')} 
                     style={styles.img}>
        <LinearGradient
            colors={["#09203f", "#537895"]}
            start={[0.1, 0.1]}
            style={styles.linearGradient}
        >
            <View style={styles.viewPermission}>
                <Text style={styles.textPermission}>{text}</Text>
            </View>
        </LinearGradient>
    </ImageBackground>
);

const styles = StyleSheet.create({
    viewPermission: {
      flex: 1,
      marginTop: 70,
    },
    textPermission: {
      paddingTop: 48,
      padding: 10,
      textAlign: 'center',
      fontSize: 25,
      color: 'white',
      fontWeight: "bold"  
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
  })