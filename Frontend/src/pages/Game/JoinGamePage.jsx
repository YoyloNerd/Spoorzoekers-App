import { Box, Button, Center, Grid, HStack, Image, Input, Text, useBreakpointValue, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router'
import PlayerCard from '../../components/game/PlayerCard'
import TeamCard from '../../components/game/TeamCard'

const JoinGamePage = ({ palette }) => {
    let { gameID } = useParams();
    const navigate = useNavigate();
    const isMobile = useBreakpointValue(
        {
            base: true,
            lg: false,
        },
    )
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(true)
    const [refreshInterval, setRefreshInterval] = useState()
    const [game, setGame] = useState()
    const [qrCode, setQrCode] = useState()
    const [teamSize, setTeamSize] = useState(5)
    const [players, setPlayers] = useState([])
    const [teams, setTeams] = useState([])

    useEffect(() => {
        axios.get(`/api/game/cur/${gameID}/true/false`, { withCredentials: true }).then(res => {
            setGame(res.data.game)
            setPlayers(res.data.players)
            setQrCode(res.data.qr)
            if (res.data.game.started) {
                setIsPlaying(true)
                let i = setInterval(updateTeams, 1000)
                setRefreshInterval(i)
            } else {
                let i = setInterval(updatePlayers, 1000)
                setRefreshInterval(i)
            }
        }).then(() => {
            setLoading(false)
        }).catch(err => {
            console.log(err)
            navigate("/404")
        })
    }, [])

    const updatePlayers = () => {
        axios.get(`/api/game/cur/${gameID}/false/false`, { withCredentials: true }).then(res => {
            setPlayers(res.data.players)
        })
    }
    const updateTeams = () => {
        axios.get(`/api/game/cur/${gameID}/false/true`, { withCredentials: true }).then(res => {
            setPlayers(res.data.players)
            setTeams(res.data.teams)
            console.log(res.data.teams)
        })
    }

    const deletePlayer = (playerID) => {
        axios.get(`/api/game/player/delete/${gameID}/${playerID}`, { withCredentials: true })

        setPlayers(players.filter(player => player.uuid !== playerID));
    }

    const startGame = () => {
        axios.get(`/api/game/play/${gameID}/${teamSize}`, { withCredentials: true }).then(res => {
            clearInterval(refreshInterval)
            let i = setInterval(updateTeams, 1000)
            setRefreshInterval(i)

            setGame(res.data.game);
            setIsPlaying(true);
        }
        )
    }


    const changeGroupSize = (type) => {
        let size = teamSize;
        if (type === "add") {
            size += 1
        }
        else if (type === "remove") {
            size -= 1
        }
        if (size <= 0) {
            return setTeamSize(1)
        }
        if (size >= 100) {
            return setTeamSize(100)
        }
        setTeamSize(size)
    }

    return (
        <HStack>
            {loading ? <Text>Loading...</Text> : (isPlaying ?
                <Center width="100vw">
                    <HStack h="92vh" alignItems="flex-start">
                        <VStack w="79.5vw">
                            <VStack pt="5vh" h="100%" w="100%" pl="1vw" gap={{ base: 1, md: 2, lg: 3 }}>
                                {teams.map((team, index) => {
                                    return <TeamCard key={team.name + 84} palette={palette} name={team.name} playerCount={team.playerIds.length} completed={team.completedQuestionCount} total={team.totalQuestionCount} />
                                })}
                                {/* <TeamCard key={"lol" + 84} palette={palette} name={"lol"} completed={15} total={15} />
                                <TeamCard key={"lol" + 4} palette={palette} name={"lol"} completed={10} total={15} /> */}
                            </VStack>
                        </VStack>
                        <VStack w="20vw" pt="2vh" >
                            <VStack w="19vw" h="88vh" borderRadius="15px" bgColor={palette.quaternary} shadow="lg">
                                <Box h="4vh" />
                                {/* <Image src={qrCode} h="25vh" w="25vh" />
                                <Text fontSize="4xl" color={palette.text}>{game.code}</Text> */}
                                <Text fontSize="4xl" color={palette.text}>{players ? `Player count: ${players.length}` : `Player count: 0`}</Text>
                                <Box h="50vh" />
                                <Button
                                    color="white"
                                    borderRadius="15px"
                                    bgColor={palette.tertiary}
                                    h="5vh" w="10vw"
                                    isDisabled={players == null}
                                    onClick={() => { }}>
                                    <Text fontSize="2xl">Stop</Text>
                                </Button>
                            </VStack>
                        </VStack>
                    </HStack>
                </Center> : <Center width="100vw">
                    <HStack h="92vh" alignItems="flex-start">
                        <VStack w="79.5vw">
                            {players ?
                                <Grid pt="5vh" w="100%" pl="1vw" templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(5, 1fr)" }} gap={{ base: 1, md: 2, lg: 3 }}>
                                    {players && players.map((player, index) => {
                                        // return <Text>{player}</Text>
                                        return <PlayerCard key={player.name + player.uuid} palette={palette} name={player.name} index={index} removePlayer={() => { deletePlayer(player.uuid) }} />
                                    })}
                                </Grid> :
                                <Center h="92vh">
                                    <Text color="Black" fontSize="2xl">Scan de QR-code of voer de code in om te joinen </Text>
                                </Center>
                            }
                        </VStack>
                        <VStack w="20vw" pt="2vh" >
                            <VStack w="19vw" h="88vh" borderRadius="15px" bgColor={palette.quaternary} shadow="lg">
                                <Box h="4vh" />
                                <Image src={qrCode} h="25vh" w="25vh" />
                                <Text fontSize="4xl" color={palette.text}>{game.code}</Text>
                                <Text fontSize="4xl" color={palette.text}>{players ? `Player count: ${players.length}` : `Player count: 0`}</Text>
                                <Box h="5vh" />
                                <Text color="Black" fontSize="2xl">Groep grote</Text>
                                <HStack color="white">
                                    <Button borderRadius="15px" bgColor={palette.secondary} h="5vh" w="5vh" onClick={() => changeGroupSize("remove")}><Text fontSize="2xl">-</Text></Button>
                                    <Center borderRadius="15px" color="Black" bgColor={palette.primary} w="5vw" h="5vh"><Text fontSize="2xl">{teamSize}</Text></Center>
                                    <Button borderRadius="15px" bgColor={palette.secondary} h="5vh" w="5vh" onClick={() => changeGroupSize("add")}><Text fontSize="2xl">+</Text></Button>
                                </HStack>
                                <Box h="2vh" />
                                <Button
                                    color="white"
                                    borderRadius="15px"
                                    bgColor={palette.secondary}
                                    h="5vh" w="10vw"
                                    isDisabled={players == null}
                                    onClick={() => { startGame() }}>
                                    <Text fontSize="2xl">Start</Text>
                                </Button>
                            </VStack>
                        </VStack>
                    </HStack>
                </Center>)
            }
        </HStack>
    )
}

export default JoinGamePage