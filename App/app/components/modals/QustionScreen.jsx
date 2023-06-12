import { requestBackgroundPermissionsAsync } from 'expo-location';
import { useState } from 'react';
import { Modal, View, Pressable, StyleSheet } from 'react-native';
import QustionButton from '../buttons/QustionButton';
import AppText from '../tools/AppText';

const letters = ["A", "B", "C", "D"]

export default function QuestionScreen({ visible, setVisible, curQuestionData }) {
    const [selected, setSelected] = useState(-1);
    const data = curQuestionData ? curQuestionData : {
        question: "test",
        answers: [
            {
                ans: "test antwoord 1",
                correct: true
            },
            {
                ans: "2",
                correct: false
            },
            {
                ans: "3",
                correct: false
            },
            {
                ans: "4",
                correct: false
            }
        ]
    }

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setInfoIsVisible(false)}>
            <Pressable style={styles.ShuntDown} onPress={() => setVisible(false)}>
            </Pressable>
            <View style={styles.ModalLayout}>
                <View style={styles.InfoLabel}>
                    <AppText style={styles.InfoLabelText}>{data.question}</AppText>
                </View>
                <View style={styles.qustionButton}>
                    {data.answers.map((a, i) => {
                        if (i >= 4)
                            return
                        return <QustionButton key={`Answer: ${i}`} letter={letters[i]} answer={a.ans} selected={i == selected} select={() => { setSelected(i) }} />
                    })}
                </View>
                <Pressable style={styles.ReturnShell} onPress={() => setVisible(false)}>
                    <AppText style={styles.ReturnText}>save</AppText>
                </Pressable>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    ShuntDown: {
        flex: 0.3,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    ModalLayout: {
        flex: 1,
        width: '100%',
        maxHeight: '100%',
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    InfoLabel: {
        width: '90%',
        height: '30%',
        backgroundColor: "#046142",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 0,
        marginBottom: 10
    },
    InfoLabelText: {
        color: "#fff"
    },
    DescriptionText: {
        color: "#fff",
        marginLeft: 20,
        marginRight: 20
    },
    ReturnShell: {
        width: '70%',
        height: '10%',
        backgroundColor: "#046142",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    ReturnText: {
        color: "#fff"
    },

})