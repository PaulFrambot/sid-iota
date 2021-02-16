import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserAvatar from 'react-native-user-avatar';

export const RowContact = ({ username, title, subtitle, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <View style={styles.avatarView}>
      <UserAvatar size={40} name={username} />
    </View>
    <View style={styles.content}>
      <Text style={styles.title}>{title}</Text>
    </View>
    <View style={styles.right}>
      <Ionicons name="md-more" color="#666" size={30} />
    </View>   
  </TouchableOpacity>

);

export const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(174,182,215, 0.7)', //"#aeb6d7"
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  avatarView: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 20,
    //backgroundColor: "pink"
  },
  content: {
    //alignItems: "center",
    //justifyContent: "center",
    //backgroundColor: "red"
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#3a3a3a"
  },
  separator: {
    backgroundColor: "transparent",
    height: 1
  },
  right: {
    alignItems: "flex-end",
    flex: 1
  }
});