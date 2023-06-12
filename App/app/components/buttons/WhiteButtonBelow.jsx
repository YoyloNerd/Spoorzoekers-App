import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import AppText from '../tools/AppText'
export default function WhiteButtonBelow({name}) {
    console.log(name)
    return (
        <View style={styles.whiteButtonView}>
            <View style={styles.tempView}>

            </View>
            <TouchableOpacity
                style={styles.whiteButton}
            >
            <AppText>
                {name}
            </AppText>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    whiteButtonView:{flex:1},
    whiteButton: {
        width: "80%",
        height: "5%",
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f4f5f5",
        borderRadius: 10,

    }, tempView:{
        height: "88%",
    }
})