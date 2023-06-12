import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native'
import React, { useState } from 'react'
import MapView from 'react-native-maps'
import WhiteButtonBelow from '../components/buttons/WhiteButtonBelow'
import ScreenView from '../components/tools/ScreenView'
import QuestionScreen from '../components/modals/QustionScreen'
import AppText from '../components/tools/AppText'

export default function Map() {
    const [questionIsVisible, setQuestionIsVisible] = useState(false);

    function startQuestionScreen() {
        setQuestionIsVisible(true);
    }

    function endQuestionScreen() {
        setQuestionIsVisible(false);
    }
    return (
        <View style={styles.mapView}>
            <MapView style={styles.map}></MapView>
            <ScreenView style={styles.button}>
                <View style={styles.whiteButtonView}>
                    <View style={styles.tempView}>
                    </View>
                    <TouchableOpacity
                        style={styles.whiteButton}
                        onPress={startQuestionScreen}
                    >
                        <AppText>
                            test
                        </AppText>
                    </TouchableOpacity>
                </View>
                <QuestionScreen visible={questionIsVisible} setVisible={setQuestionIsVisible} />
            </ScreenView>
        </View>
    )
}

const styles = StyleSheet.create({
    mapView: {
        display: 'flex',
        height: "100%",
        width: "100%",
    },
    map: {
        height: "100%",
        width: "100%",
    },
    button: {
        zIndex: 1,
        position: 'absolute',
        width: '100%',
        height: "100%",
    },
    whiteButtonView: { flex: 1 },
    whiteButton: {
        width: "80%",
        height: "5%",
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f4f5f5",
        borderRadius: 10,
    },
    tempView: {
        height: "88%",
    }


})