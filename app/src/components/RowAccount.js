import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserAvatar from 'react-native-user-avatar';
import { LinearGradient } from "expo-linear-gradient";


export const RowAccount = ({ username, title, subtitle, onPress }) => (
    <LinearGradient
        colors={["rgba(223,229,246, 0.7)", "rgba(67,68,72, 0.7)"]}
        start={[0.1, 0.1]}
        style={styles.container}
    >
  <TouchableOpacity onPress={onPress} style={styles.touchable}>

    <View style={styles.avatarView}>
      <UserAvatar size={40} name={username} />
    </View>
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
    </View>
    <View style={styles.right}>
      <Ionicons name="md-lock" color="#666" size={27} />
    </View>
  </TouchableOpacity>
    </LinearGradient>

);

export const Separator = () => <View style={styles.separator} />;


const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    borderWidth: 1,
  },
  avatarView: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 20,
  },
  content: {
    alignItems: "flex-start",
    justifyContent: "center"
  },
  title: {
    fontSize: 23,
    fontWeight: "300",
    color: "#3a3a3a"
  },
  subtitle: {
    color: "#666",
    fontSize: 16,
    marginTop: 2
  },
  separator: {
    //backgroundColor: "transparent",
    height: 1
  },
  right: {
    alignItems: "flex-end",
    flex: 1,
    marginRight: 18
  },
  touchable: {
    opacity:1,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  }
});
