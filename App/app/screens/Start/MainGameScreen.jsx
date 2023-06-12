import {
    StyleSheet, TouchableOpacity, View,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import ScreenView from "../../components/tools/ScreenView";
import QuestionScreen from '../../components/modals/QustionScreen'
import AppText from "../../components/tools/AppText";
import * as geolib from 'geolib';
import axios from "axios";

function generateRandomPoints(minDistance, maxDistance, amountOfPoints, location) {
    let pointsArray = [];

    //generate random points in circle
    for (let i = 0; pointsArray.length < amountOfPoints; i++) {
        let point = null;
        while (point === null) {
            let x = Math.random() * 2 - 1;
            let y = Math.random() * 2 - 1;
            if (x * x + y * y < 1) {
                point = [x * maxDistance, y * maxDistance];
            }
        }
        pointsArray.push(point);
        //make sure that the points are not too close to each other
        for (let i = 0; i < pointsArray.length; i++) {
            for (let j = i + 1; j < pointsArray.length; j++) {
                let distance = Math.sqrt(
                    Math.pow(pointsArray[i][0] - pointsArray[j][0], 2) +
                    Math.pow(pointsArray[i][1] - pointsArray[j][1], 2)
                );
                if (distance < maxDistance * 0.1) {
                    pointsArray.splice(j, 1);
                    j--;
                }
            }
        }
        //make sure that the points are not to close to the center
        for (let i = 0; i < pointsArray.length; i++) {
            let distance = Math.sqrt(
                Math.pow(pointsArray[i][0], 2) +
                Math.pow(pointsArray[i][1], 2)
            );
            if (distance < minDistance) {
                pointsArray.splice(i, 1);
                i--;
            }
        }
    }
    //convert points to long/lat
    let tempArray = [];
    for (let i = 0; i < pointsArray.length; i++) {
        let point = pointsArray[i];
        let x = Number(point[0]);
        let y = Number(point[1]);
        let lat = x * 0.000009 + location.coords.latitude;
        let lon = y * 0.00001 + location.coords.longitude;
        tempArray.push([lat, lon]);
    }
    return tempArray;
}

export default function MainGameScreen({ player, code, setPlayer, loggedOut }) {
    const [points, setPoints] = useState(0);
    const [markers, setMarkers] = useState([]);
    const [markerSet, setMarkerSet] = useState(false);
    const [curInterval, setCurInterval] = useState(null);

    const [location, setLocation] = useState(null);
    const [pointsArray, setPointsArray] = useState([]);

    const [once, setOnce] = useState(true);
    const [maxDistance,] = useState(500);
    const [minDistance,] = useState(100);
    const [detectionR,] = useState(20);

    const [questionIsVisible, setQuestionIsVisible] = useState(false);
    const [curQuestion, setCurQuestion] = useState(0);
    const [showButton, setShowButton] = useState(false);

    function startQuestionScreen() {
        setQuestionIsVisible(true);
    }

    async function loopThroughPoints(radius, markers) {
        let location = await Location.getCurrentPositionAsync({})
        if (location) {
            for (let i = 0; i < points.length; i++) {
                if (geolib.isPointWithinRadius(
                    { latitude: location.coords.latitude, longitude: location.coords.longitude },
                    { latitude: markers[i].latitude, longitude: markers[i].longitude },
                    radius
                )) {
                    console.log("point " + i + " is near player")
                    setQuestionIsVisible(true);
                    setCurQuestion(i);
                    break;
                }
            }
        }
    }

    useEffect(() => {
        if (once)
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }
                let location = await Location.getCurrentPositionAsync({})
                setLocation(location);

                if (player.isLeader) {
                    let curMarkers;

                    axios.get(`/api/game/player/data/${code}/${player.uuid}`).then((res) => {
                        curMarkers = res.data.markers;
                        setPlayer(res.data.player)
                        setPoints(res.data.points)
                        setMarkers(res.data.markers)
                    }).then(() => {
                        if (!curMarkers[0].longitude) {
                            let amountOfPoints = curMarkers.length;
                            let points = generateRandomPoints(minDistance, maxDistance, amountOfPoints, location);
                            for (let i = 0; i < points.length; i++) {
                                curMarkers[i].longitude = points[i][1];
                                curMarkers[i].latitude = points[i][0];
                            }
                            setMarkers(curMarkers);
                            axios.post(`/api/game/player/data/${code}/${player.uuid}`, { markers: curMarkers }).then((res) => {
                                console.log("updated markers")
                            }).catch((err) => {
                                loggedOut("Game not found")
                            })
                            setPointsArray(points);
                            setMarkerSet(true);
                        }

                        setCurInterval(setInterval(function () {
                            loopThroughPoints(detectionR, curMarkers);
                        }, 1000)
                        )

                        Location.watchPositionAsync({ distanceInterval: 1 }, (location) => { setLocation(location) });
                        setOnce(false);

                    }).catch((err) => {
                        loggedOut("Game not found")
                    })

                    // clearInterval(interval);

                } else if (!player.isLeader) {
                    const load = () => {
                        setTimeout(() => {
                            let curMarkers;
                            axios.get(`/api/game/player/data/${code}/${player.uuid}`).then((res) => {
                                curMarkers = res.data.markers;
                                setPlayer(res.data.player)
                                setPoints(res.data.points)
                                if (Number(res.data.markers.latitude) != NaN) {
                                    setMarkers(res.data.markers);
                                    setMarkerSet(true);
                                }
                                if (!res.data.markers)
                                    load();
                            }).catch((err) => {
                                loggedOut("Game not found")
                            })
                        }, 500);
                    }
                    load();
                }
            })();
    }, []);


    return (
        <View style={styles.container}>
            {location !== null && <MapView
                style={styles.map}
                initialRegion={
                    {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0142,
                        longitudeDelta: 0.0092,
                    }
                }
            >
                {markerSet && <>
                    {markers.map((marker, index) => {
                        return <Marker
                            key={`${index}Marker`}
                            image={require("../../../assets/marker25.png")}
                            coordinate={{
                                latitude: Number(marker.latitude),
                                longitude: Number(marker.longitude),
                            }}
                        />
                    })}
                    {markers.map((marker, index) => {
                        return <Circle
                            key={`${index}Circle`}
                            center={{
                                latitude: Number(marker.latitude),
                                longitude: Number(marker.longitude),
                            }}
                            radius={detectionR}
                            fillColor="rgba(0, 0, 0, 0.2)"
                            strokeColor="rgba(0, 0, 0, 0.5)"
                        />
                    })}
                </>}
                <Circle
                    center={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }}
                    radius={maxDistance}
                    fillColor="rgba(0, 0, 255, 0.05)"
                    strokeColor="rgba(0, 0, 255, 0.3)"
                />
                <Circle
                    center={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }}
                    radius={minDistance}
                    fillColor="rgba(255, 0, 255, 0.05)"
                    strokeColor="rgba(255, 0, 255, 0.3)"
                />
                <Circle
                    center={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }}
                    radius={detectionR}
                    fillColor="rgba(0, 200, 200, 0.8)"
                    strokeColor="rgba(255, 255, 255, 0.9)"
                />
            </MapView>}
            {showButton &&
                <TouchableOpacity style={styles.overlay}
                    onPress={() => {
                        setShowButton(false);
                    }}>
                    <ScreenView style={styles.overlayScreen}>
                        <TouchableOpacity
                            style={styles.whiteButton}
                            onPress={startQuestionScreen}>
                            <AppText>
                                Answer
                            </AppText>
                        </TouchableOpacity>
                        <QuestionScreen visible={questionIsVisible} setVisible={setQuestionIsVisible} curQuestionData={data[curQuestion]} />
                    </ScreenView>
                </TouchableOpacity>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'baseline',
        justifyContent: "center",
        height: '100%',
        width: '100%',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        zIndex: 1,
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
    overlayScreen: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    button: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
    },
    whiteButton: {
        width: "60%",
        height: "7%",
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f4f5f5",
        borderRadius: 10,
        marginBottom: 12,
    },
});