import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import AppText from '../tools/AppText'

const QustionButton = ({ letter, answer, selected, select }) => {
  return (
    <TouchableOpacity
      style={selected ? styles.qustionWrapperSelected : styles.qustionWrapper}
      onPress={select}>
      <AppText style={selected ? styles.textSelected : styles.textNormal}>{`${letter}: ${answer}`}</AppText>
    </TouchableOpacity>
  )
}

export default QustionButton

const styles = StyleSheet.create({
  qustionWrapper: {
    minWidth: '90%',
    backgroundColor: "#fff",
    borderColor: "#046142",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    padding: 20,
  },
  qustionWrapperSelected: {
    minWidth: '90%',
    backgroundColor: "#046142",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    padding: 20,
  },
  textNormal: {
    color: "#046142",
  },
  textSelected: {
    color: "#fff",
  },
})