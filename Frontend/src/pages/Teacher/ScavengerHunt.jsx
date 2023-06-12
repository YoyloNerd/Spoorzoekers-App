import { Box, Button, Center, Flex, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, useBreakpointValue, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import TableTop from '../../components/teacher/ScavengerHunt/ScavengerHuntTableTop'
import SpeurtochtItem from '../../components/teacher/ScavengerHunt/ScavengerHuntItem'
import axios from 'axios'
import { useNavigate } from 'react-router'

const ScavengerHunt = ({ palette }) => {
    const toast = useToast()
    const id = 'test-toast'
    const navigate = useNavigate();
    const isMobile = useBreakpointValue(
        {
            base: true,
            lg: false,
        },
    )

    const [search, setSearch] = useState("");
    const [allScavengerHunts, setAllScavengerhunts] = useState();

    const [speurtochten, setSpeurtochten] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('');

    useEffect(() => {
        axios.get('/api/teacher/scavengerhunt/all', { withCredentials: true }).then(res => {
            setSpeurtochten(res.data.hunts)
            setAllScavengerhunts(res.data.hunts)
        }).then(() => {
            setLoading(false)
        })
    }, [])

    const createScavengerHunt = () => {
        axios.get('/api/teacher/scavengerhunt/new/' + name, { withCredentials: true }).then(res => {
            console.log(res.data)
            let hunts = [...speurtochten, res.data.hunt].sort((a, b) => {
                if (a.name.toLocaleLowerCase() < b.name.toLocaleLowerCase()) {
                    return -1;
                }
                if (a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()) {
                    return 1;
                }
                return 0;
            })
            setSpeurtochten(hunts)
        })
        setName('');
    }

    const editScavengerHunt = (uuid) => {
        navigate(`/scavengerhunts/${uuid}/questions`)
    }

    const deleteScavengerHunt = (uuid, name) => {
        axios.get('/api/teacher/scavengerhunt/delete/' + uuid, { withCredentials: true }).then(res => {
            if (res.data.success) {
                setSpeurtochten(speurtochten.filter(item => item.uuid !== uuid))
                toast({
                    position: 'top',
                    status: 'success',
                    variant: 'subtle',
                    title: 'Deleted ' + name,
                })
            }
            else
                if (!toast.isActive(id)) {
                    toast({
                        id,
                        position: 'top',
                        status: 'error',
                        variant: 'subtle',
                        title: 'Error something went wrong while deleting that scavengerhunt.',
                    })
                }

        })
    }

    const searchScavengerhunts = (e) => {
        setSearch(e.target.value);
        if (e.target.value === "") {
            setSpeurtochten(allScavengerHunts)
            return;
        }
        let hunts = allScavengerHunts.filter(item => item.name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
        setSpeurtochten(hunts)
    }

    return (
        <HStack>
            {loading ? <Text>Loading...</Text> : <Center width="100vw">
                <Center minH="92vh">
                    <Box bgColor={palette.quaternary} width="82vw" minH="89vh" mt={2} p={2} borderRadius="15px" shadow="lg">
                        <Center >
                            <VStack maxWidth="120rem">
                                {isMobile ?
                                    <VStack w="81vw" pt={8} >
                                        <Text fontSize="4xl">Speurtochten</Text>
                                        <HStack>
                                            <Input
                                                placeholder='search'
                                                size='lg' h="6vh" w="56vw"
                                                borderRadius="15px"
                                                bgColor={palette.background}
                                                value={search}
                                                onChange={(e) => searchScavengerhunts(e)} />
                                            <Button bgColor={palette.secondary} color="white" h="6vh" w="8vh" borderRadius="15px" onClick={() => onOpen()}>
                                                <Text fontSize="2xl">+</Text>
                                            </Button>
                                        </HStack>
                                    </VStack>
                                    :
                                    <HStack w="78vw" pt={8} >
                                        <Text fontSize="4xl">Speurtochten</Text>
                                        <Box w="40vw" />
                                        <Input
                                            placeholder='search'
                                            size='lg' h="6vh" w="25vw"
                                            borderRadius="15px"
                                            bgColor={palette.background}
                                            value={search}
                                            onChange={(e) => searchScavengerhunts(e)} />
                                        <Button bgColor={palette.secondary} color="white" h="6vh" w="7vw" borderRadius="15px" onClick={() => onOpen()}>
                                            <Text fontSize="2xl">+</Text>
                                        </Button>
                                    </HStack>}
                                <VStack w="85vw" p={5}>
                                    <TableTop palette={palette} />
                                    <Box h="0.5vh" />
                                    {speurtochten && speurtochten.map((item, index) => {
                                        return <SpeurtochtItem key={item.name + item.uuid} palette={palette} name={item.name} edit={() => editScavengerHunt(item.uuid)} del={() => deleteScavengerHunt(item.uuid, item.name)} />
                                    })}
                                </VStack>
                            </VStack>
                        </Center>
                    </Box>
                </Center>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Maak een nieuwe speurtocht aan</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>Naam:</Text>
                            <Input
                                placeholder='Speurtocht naam'
                                size='lg' h="6vh" width={"25rem"}
                                borderRadius="15px"
                                bgColor={palette.primary}
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button bgColor={palette.secondary} color="white" mr={3} onClick={() => { createScavengerHunt(); onClose(); }}>
                                Create
                            </Button>
                            <Button variant='ghost' onClick={onClose}>Sluiten</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </Center>}
        </HStack>
    )
}

export default ScavengerHunt