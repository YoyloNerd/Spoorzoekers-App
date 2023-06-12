import { View, Text, StyleSheet, Dimensions, Pressable, TextInput, Modal, TouchableOpacity, } from 'react-native';
import React, { useEffect } from 'react';
import { useState } from 'react';

import MainScreenLayout from '../../layouts/MainScreenLayout';
import InfoScreen from '../../components/modals/InfoScreen';
import AppText from '../../components/tools/AppText';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function IntroScreen({ setCode, join, reason, scanBarcode }) {
  const [infoIsVisible, setInfoIsVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  function startInfoScreen() {
    setInfoIsVisible(true);
  }

  function endInfoScreen() {
    setInfoIsVisible(false);
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setIsScanning(false)
    scanBarcode(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <MainScreenLayout style={styles.MainLayout}>
      {isScanning ?
        <View style={{ height: "100%", backgroundColor: "#000" }}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: "75%", marginTop: "20%" }}
          />
          <View style={styles.closeQRContainer}>
            <Pressable style={styles.closeQR} onPress={() => setIsScanning(false)}>
              <AppText style={styles.ConfirmButtonText}>Sluiten</AppText>
            </Pressable>
          </View>
        </View> :
        <View style={{ height: "100%" }}>
          <View style={styles.InfoButtonContainer}>
            <Pressable onPress={startInfoScreen} style={styles.InfoButtonShell}>
              <AppText style={styles.InfoButtonText}>i</AppText>
            </Pressable>
          </View>
          <View style={styles.Title}>
            <AppText>Speurtocht</AppText>
          </View>
          <View style={styles.LoginCodes}>
            <View style={styles.CodeInputShell}>
              <TextInput placeholder="Code" keyboardType={'numeric'} style={styles.CodeInputText} textAlign={'center'} onChangeText={setCode} />
            </View>
            <Pressable style={styles.QRButtonShell} onPress={() => { setScanned(false); setIsScanning(true) }}>
              <AppText style={styles.QRButtonText}>Scan QR Code</AppText>
            </Pressable>
          </View>
          {reason && <AppText style={styles.QRButtonText}>{reason}</AppText>}
          <View style={styles.ConfirmButtonContainer}>
            <Pressable style={styles.ConfirmButtonShell} onPress={join}>
              <AppText style={styles.ConfirmButtonText}>Bevestig</AppText>
            </Pressable>
          </View>
          <InfoScreen visible={infoIsVisible} setVisible={setInfoIsVisible} />
        </View>}
    </MainScreenLayout>
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
  Title: {
    width: '90%',
    height: '20%',
    marginTop: 50,
    margin: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  LoginCodes: {
    width: '90%',
    height: '50%',
    margin: 20,
    marginTop: 5,
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
  CodeInputShell: {
    width: '80%',
    height: '10%',
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    minHeight: 30
  },
  CodeInputText: {
    backgroundColor: "#EAEAEA",
    borderRadius: 10,
    width: '100%',
    height: '100%',
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir"
  },
  QRButtonShell: {
    width: '80%',
    height: '10%',
    backgroundColor: "#DBFF4A",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    minHeight: 30
  },
  QRButtonText: {
    color: "#004630"
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
  },
  closeQRContainer: {
    borderRadius: 20,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#046142",
  },
  closeQR: {
    borderRadius: 20,
    width: '80%',
    height: '15%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#046142",
  }
})