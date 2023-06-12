import { Box, Button, Center, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Switch, Text, useBreakpointValue, useDisclosure, useToast, VStack } from "@chakra-ui/react"
import TableTop from "../../components/teacher/questions/QuestionTableTop"
import QuestionItem from "../../components/teacher/questions/QuestionItem"
import QuestionSidebar from "../../components/teacher/questions/QuestionSidebar"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router"
import { AiFillSetting, AiOutlineCheck, AiOutlineClose } from "react-icons/ai"

const Questions = ({ palette }) => {
    let { huntID } = useParams();
    const navigate = useNavigate();
    const toast = useToast()
    const id = 'test-toast'

    const { isOpen, onOpen, onClose } = useDisclosure()
    const isMobile = useBreakpointValue(
        {
            base: true,
            lg: false,
        },
    )
    
    const [search, setSearch] = useState("");
    const [allQuestions, setAllQuestions] = useState();

    const [name, setName] = useState('');
    const [hunt, setHunt] = useState();
    const [teamSize, setTeamSize] = useState(5)
    const [questions, setQuestions] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/teacher/scavengerhunt/hunt/${huntID}/true`, { withCredentials: true }).then(res => {
            setHunt(res.data.hunt);
            setName(res.data.hunt.name)
            setQuestions(res.data.questions);
            setAllQuestions(res.data.questions);
        }).then(() => {
            setLoading(false);
        })
    }, [])

    const createQuestion = () => {
        axios.get('/api/teacher/question/new/' + huntID, { withCredentials: true }).then(res => {
            navigate(`/scavengerhunts/${huntID}/questions/${res.data.uuid}`)
        })
    }
    const editQuestion = (uuid) => {
        navigate(`/scavengerhunts/${huntID}/questions/${uuid}`)
    }

    const searchQuestions = (e) => {
        setSearch(e.target.value);
        if (e.target.value === "") {
            setQuestions(allQuestions);
            return;
        }
        let newQuestions = allQuestions.filter((item) => {
            return item.question.toLowerCase().includes(e.target.value.toLowerCase());
        })
        setQuestions(newQuestions);
    }

    const updateName = () => {
        axios.get(`/api/teacher/scavengerhunt/update/${huntID}/${name}`, { withCredentials: true }).then(res => {
            setHunt(res.data.hunt);
            setName(res.data.hunt.name)
            setQuestions(allQuestions);
        }).then(() => {
            setLoading(false);
        })
    }

    const deleteQuestion = (uuid) => {
        axios.delete('/api/teacher/question/delete/' + huntID + "/" + uuid, { withCredentials: true }).then(res => {
            console.log(res.data)
            if (res.data.success) {
                toast({
                    id,
                    position: 'top',
                    status: 'success',
                    variant: 'subtle',
                    title: 'Question deleted',
                })
                setQuestions(questions.filter((item) => {
                    return item.uuid !== uuid;
                }))
            }
            else
                if (!toast.isActive(id)) {
                    toast({
                        id,
                        position: 'top',
                        status: 'error',
                        variant: 'subtle',
                        title: 'Error something went wrong while deleting this question',
                    })
                }
        })
    }

    const startGame = () => {
        axios.get(`/api/game/start/${huntID}/${teamSize}`, { withCredentials: true }).then(res => {
            navigate(`/game/${res.data.uuid}`)
        })
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
            {loading ? <Text>Loading...</Text> : <>
                {!isMobile && <VStack h="92vh">
                    <QuestionSidebar palette={palette} scavengerhunt={hunt.name} mainButton={() => { navigate(`/scavengerhunts/${huntID}/questions`) }}>
                        {questions && questions.map((item) => {
                            return <Button
                                key={item.question + item.uuid + "side"}
                                minH="5vh" w="10vw"
                                borderRadius="15px"
                                shadow="lg"
                                bgColor={palette.quaternary}
                                whiteSpace={'initial'}
                                onClick={() => { editQuestion(item.uuid) }}>
                                {item.question}
                            </Button>
                        })}
                    </QuestionSidebar>
                </VStack>}
                <Center h="92vh" w={{ base: "100vw", lg: "auto" }}>
                    <Box bgColor={palette.quaternary} width="82vw" h="89vh" p={2} borderRadius="15px" shadow="lg">
                        <Center>
                            <VStack maxWidth="120rem">
                                {isMobile ? <VStack w="81vw" pt={4} >
                                    <Center w="81vw"><Text fontSize="2xl" w="74vw" textAlign="center">{hunt.name}</Text></Center>
                                    <Button bgColor={palette.secondary} color="white" h="6vh" borderRadius="15px" onClick={() => { startGame() }}>
                                        <Text fontSize="2xl">Start Spel</Text>
                                    </Button>
                                    <Box w="37vw" />
                                    <HStack>
                                        <Input
                                            placeholder='search'
                                            size='lg' h="6vh" w="50vw"
                                            borderRadius="15px"
                                            bgColor={palette.background}
                                            onChange={(e) => searchQuestions(e)} />
                                        <Button bgColor={palette.secondary} color="white" h="6vh" w="5vh" borderRadius="15px" onClick={() => createQuestion()}>
                                            <Text fontSize="2xl">+</Text>
                                        </Button>
                                        <IconButton
                                            bgColor={palette.primary}
                                            color="white"
                                            h="6vh" w="6vh"
                                            borderRadius="15px"
                                            onClick={() => { onOpen(); }}
                                            icon={<AiFillSetting color="black" size={30} />}
                                        />
                                    </HStack>
                                </VStack> :
                                    <HStack w="79vw" pt={8} >
                                        <Button bgColor={palette.secondary} color="white" h="6vh" w="10vw" borderRadius="15px" onClick={() => { startGame() }}>
                                            <Text fontSize="2xl">Start Spel</Text>
                                        </Button>
                                        <Box w="37vw" />
                                        <Input
                                            placeholder='search'
                                            size='lg' h="6vh" w="25vw"
                                            borderRadius="15px"
                                            bgColor={palette.background}
                                            value={search}
                                            onChange={(e) => searchQuestions(e)} />
                                        <Button bgColor={palette.secondary} color="white" h="6vh" w="8vh" borderRadius="15px" onClick={() => { createQuestion() }}>
                                            <Text fontSize="2xl">+</Text>
                                        </Button>
                                        <IconButton
                                            bgColor={palette.primary}
                                            color="white"
                                            h="6vh" w="6vh"
                                            borderRadius="15px"
                                            onClick={() => { onOpen(); }}
                                            icon={<AiFillSetting color="black" size={40} />}
                                        />
                                    </HStack>
                                }
                                <VStack w="85vw" p={5}>
                                    <TableTop palette={palette} />
                                    <Box h="0.5vh" />
                                    {questions && questions.map((item) => {
                                        return <QuestionItem
                                            key={item.name + item.uuid + "side"}
                                            palette={palette} name={item.question}
                                            edit={() => editQuestion(item.uuid)}
                                            del={() => deleteQuestion(item.uuid)}
                                        />
                                    })}
                                </VStack>
                            </VStack>
                        </Center>
                    </Box>
                </Center>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Verander speurtocht naam</ModalHeader>
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
                            <Button bgColor={palette.secondary} color="white" mr={3} onClick={() => { updateName(); onClose(); }}>
                                Create
                            </Button>
                            <Button variant='ghost' onClick={onClose}>Sluiten</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>}
        </HStack>
    )
}

export default Questions