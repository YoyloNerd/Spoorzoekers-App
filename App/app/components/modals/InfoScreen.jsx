import { requestBackgroundPermissionsAsync } from 'expo-location';
import { useState } from 'react';
import { Modal, View, Text, Pressable, ProgressViewIOSComponent, Touchable, StyleSheet } from 'react-native';
import AppText from '../tools/AppText';

export default function InfoScreen({ visible, setVisible }) {

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setInfoIsVisible(false)}>
            <Pressable  style={styles.ShuntDown} onPress={() => setVisible(false)}>
            </Pressable>

            <View style={styles.ModalLayout}>
                <View style={styles.InfoLabel}>
                    <AppText style={styles.InfoLabelText}>Spel Info</AppText>
                </View>
                <View style={styles.Description}>
                    <AppText style={styles.DescriptionText}>Sample Description</AppText>
                </View>
                <Pressable style={styles.ReturnShell} onPress={() => setVisible(false)}>
                    <AppText style={styles.ReturnText}>Terug</AppText>
                </Pressable>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    ShuntDown: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    ModalLayout: {
        flex: 3,
        width: '100%',
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },
    InfoLabel: {
        width: '90%',
        height: '8%',
        backgroundColor: "#046142",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10
    },
    InfoLabelText: {
        color: "#fff"
    },
    Description: {
        height: '75%',
        width: '90%',
        backgroundColor: "#BCC011",
        color: "#fff",
        borderRadius: 10
    },
    DescriptionText: {
        color: "#fff",
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20
    },
    ReturnShell: {
        width: '70%',
        height: '8%',
        backgroundColor: "#046142",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    ReturnText: {
        color: "#fff"
    }
})