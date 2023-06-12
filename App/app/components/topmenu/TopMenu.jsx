import { Text, StyleSheet, View, Dimensions } from 'react-native'
import React, { Component } from 'react'

export default function TopMenu() {
  return (
    <View style={styles.TopMenu}>
      <Text>test</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  TopMenu: {
    backgroundColor: "#fff",
    width: (Dimensions.get('window').width/100*80),
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius:20,
    marginTop: 10,
  },
})