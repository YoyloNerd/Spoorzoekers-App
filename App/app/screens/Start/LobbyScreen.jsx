import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, Modal, TouchableOpacity, } from 'react-native';
import React, { useEffect } from 'react';
import { useState } from 'react';

import MainScreenLayout from '../../layouts/MainScreenLayout';
import InfoScreen from '../../components/modals/InfoScreen';
import AppText from '../../components/tools/AppText';
import axios from 'axios';

export default function LobbyScreen({ setName, hasError, joinGame, joined, gameData, loggedOut, loadGame }) {
  const [infoIsVisible, setInfoIsVisible] = useState(false);

  function startInfoScreen() {
    setInfoIsVisible(true);
  }

  const checkGameState = () => {
    axios.get(`/api/game/player/status/${gameData.code}/${gameData.player.uuid}`).then(res => {
      if (res.data.success) {
        setTimeout(() => {
          checkGameState();
        }, 1000);
        if (res.data.inGame)
          loadGame();
      } else {
        loggedOut(res.data.reason);
      }
    }).catch(err => {
      console.log(err)
      loggedOut(res.data.reason);
    })
  }
  useEffect(() => {
    if (joined)
      setTimeout(() => {
        checkGameState();
      }, 1000);
  }, [joined])

  return (
    <MainScreenLayout style={styles.MainLayout}>
      <View style={styles.InfoButtonContainer}>
        <Pressable onPress={startInfoScreen} style={styles.InfoButtonShell}>
          <AppText>i</AppText>
        </Pressable>
      </View>
      {joined ?
        <View style={styles.Lobby}>
          <AppText>Je bent in</AppText>
          <AppText>Wacht totdat het spel gestart wordt</AppText>
        </View> :
        <View style={styles.Join}>
          <View style={styles.NameInputShell}>
            <TextInput placeholder="Naam" style={styles.NameInputText} textAlign={'center'} onChangeText={setName} />
          </View>
          <Pressable style={styles.JoinButton} onPress={() => { joinGame() }}>
            <AppText style={styles.JoinButtonText}>Join</AppText>
          </Pressable>
        </View>
      }
      {hasError && <AppText style={styles.JoinButtonText}>Error Code Not found</AppText>}
      <InfoScreen visible={infoIsVisible} setVisible={setInfoIsVisible} />
    </MainScreenLayout >
  )
}

const styles = StyleSheet.create({
  MainLayout: {
    flex: 1,
    backgroundColor: "#147D7E",
    width: (Dimensions.get('window').width),
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,

  },
  InfoButtonContainer: {
    width: '100%',
    height: '5%',
    marginLeft: 20,
    elevation: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  InfoButtonShell: {
    width: '7%',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginLeft: 270,
    borderRadius: 20,
    minHeight: 25
  },
  Lobby: {
    width: '90%',
    height: '80%',
    margin: 20,
    marginTop: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  Join: {
    width: '90%',
    height: '80%',
    margin: 20,
    marginTop: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  NameInputShell: {
    width: '85%',
    height: '10%',
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    minHeight: 30
  },
  NameInputText: {
    backgroundColor: "#EAEAEA",
    borderRadius: 10,
    width: '100%',
    height: '100%',
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir"
  },
  JoinButton: {
    width: '80%',
    height: '10%',
    backgroundColor: "#004630",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    minHeight: 30
  },
  JoinButtonText: {
    color: "#fff"
  },
  ConfirmButtonContainer: {
    width: '90%',
    height: '8%',
    marginLeft: 20,
    alignItems: "center",
    borderRadius: 5,
  },
  ConfirmButtonShell: {
    backgroundColor: "#046142",
    width: '100%',
    height: '100%',
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  ConfirmButtonText: {
    color: "#fff"
  }
})