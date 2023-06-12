import {
  StyleSheet,
} from "react-native";

import IntroScreen from "./app/screens/Start/IntroScreen";
import PointGenerationTest from "./app/screens/PointGenerationTest";
import { useReducer, useState } from "react";
import axios from "axios";
import LobbyScreen from "./app/screens/Start/LobbyScreen";
import MainGameScreen from "./app/screens/Start/MainGameScreen";

export default function App() {
  axios.defaults.baseURL = 'https://downloads.yoylo.moe';

  const [appState, setAppState] = useState("IntroScreen")
  const [reason, setReason] = useState("")
  const [name, setName] = useState("")
  const [player, setPlayer] = useState()
  const [code, setCode] = useState("")

  const setPlayerState = (newState) => {
    if (newState === player)
      return
    if (newState === undefined)
      return
    if (newState === null)
      return
    setPlayer(newState)
  }

  const join = async (newCode) => {
    if (!newCode) {
      newCode = code
    }
    setCode(newCode);

    axios.get(`/api/game/player/checkjoin/${newCode}`).then((res) => {
      if (res.data.joinable) {
        setAppState("LobbyScreen")
        setReason("")
      } else {
        setReason("Game already started")
      }
    }).catch((err) => {
      setReason("Code not Valid")
    })
  }

  const joinGame = async () => {
    axios.get(`/api/game/player/join/${code}/${name}`).then((res) => {
      if (res.data.joined) {
        setPlayerState(res.data.player)
        setReason("")
      } else {
        setReason("Game already started")
      }
    }).catch((err) => {
      setReason("Game not found")
    })
  }
  const loadGame = async () => {
    setReason("")
    axios.get(`/api/game/player/data/${code}/${player.uuid}`).then((res) => {
      if (res.data) {
        setPlayerState(res.data.player)
        setAppState("GameScreen")
      }
    }).catch((err) => {
      // loggedOut("Game not found")
    })
  }


  return (<>
    {appState === "IntroScreen" && <IntroScreen setCode={setCode} join={() => join()} scanBarcode={join} reason={reason} />}
    {appState === "LobbyScreen" && <LobbyScreen setName={setName} joinGame={joinGame} loadGame={loadGame} joined={player ? true : false} gameData={{ code, player }} loggedOut={(err) => { setReason(err); setName(); setPlayer(); setCode(""); setAppState("IntroScreen") }} />}
    {appState === "GameScreen" && <MainGameScreen player={player} code={code} setPlayer={setPlayerState} loggedOut={(err) => { setReason(err); setName(); setPlayer(); setCode(""); setAppState("IntroScreen") }} />}
  </>)
}

const styles = StyleSheet.create({

});
