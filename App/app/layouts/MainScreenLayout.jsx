import { Text, StyleSheet, View, Dimensions } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import ScreenView from '../components/tools/ScreenView';


export default function MainScreenLayout({ children }) {
  return (
    <View style={styles.MainLayout}>
      <View style={styles.View1} />
      <View style={styles.View2} />
      <ScreenView style={styles.children}>{children}</ScreenView>
    </View>
  )
}

const styles = StyleSheet.create({
  MainLayout: {
    flex: 1,
    width: (Dimensions.get('window').width),
    alignItems: "center",
    justifyContent: "center",
  },
  View1: {
    width: '100%',
    height: '25%',
    backgroundColor: "#004630",
    alignItems: "center",
    padding: 50,

  },
  View2: {
    width: '100%',
    height: '75%',
    backgroundColor: "#EAEAEA",
    alignItems: "center",

  },
  children: {
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    width: "100%"
  }
})