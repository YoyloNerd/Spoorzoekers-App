import { Box, Button, Center, Flex, HStack, Input, Spacer, Text, Textarea, useBreakpointValue, useToast, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import SidebarSpeurtocht from '../../components/teacher/questions/QuestionSidebar'
import Answer from '../../components/teacher/questionForm/Answer'
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';


function QuestionForm({ palette }) {
    let { huntID, uuid } = useParams();
    const toast = useToast()
    const error = 'test-toast'
    const limit = 'toast-limit'
    const navigate = useNavigate();
    const isMobile = useBreakpointValue(
        {
            base: true,
            lg: false,
        },
    )

    const [huntName, setHuntName] = useState("");
    const [questions, setQuestions] = useState("");
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState([]);
    const [hint, setHint] = useState("");

    useState(() => {
        axios.get(`/api/teacher/scavengerhunt/hunt/${huntID}/false`, { withCredentials: true }).then(res => {
            console.log(res.data)
            setHuntName(res.data.hunt.name);
            setQuestions(res.data.questions);
        })

        axios.get('/api/teacher/question/question/' + uuid, { withCredentials: true }).then(res => {
            console.log(res.data)
            if (!res.data.question)
                navigate('/scavengerhunts/' + huntID + '/questions')

            setQuestion(res.data.question.question);
            setHint(res.data.question.hint);
            let answers = res.data.question.answers;
            if (answers.length === 0) {
                answers = [{ answer: "", correct: true }, { answer: "", correct: false }]
            }
            setAnswers(answers)
        }).then(() => {
            setLoading(false)
        })
    }, [])

    const updateAnswer = (index, answer, correct) => {
        let newAnswers = [...answers];
        newAnswers[index] = { answer: answer, isCorrect: correct };
        setAnswers(newAnswers);
    }
    const saveQuestion = () => {
        axios.post('/api/teacher/question/update/' + uuid, { question, answers, hint }, { withCredentials: true }).then(res => {
            console.log(res.data)
            navigate('/scavengerhunts/' + huntID + '/questions')
        })
    }
    const editQuestion = (changeuuid) => {
        if (changeuuid === uuid)
            return
        navigate(`/scavengerhunts/${huntID}/questions/${changeuuid}`)
        window.location.reload(false);
    }
    const deleteQuestion = () => {
        axios.delete('/api/teacher/question/delete/' + huntID + "/" + uuid, { withCredentials: true }).then(res => {
            console.log(res.data)
            if (res.data.success)
                navigate('/scavengerhunts/' + huntID + '/questions')
            else
                if (!toast.isActive(error)) {
                    toast({
                        id: error,
                        position: 'top',
                        status: 'error',
                        variant: 'subtle',
                        title: 'Error something went wrong while deleting this question',
                    })
                }
        })
    }

    const addAnswer = () => {
        if (answers.length >= 4) {
            if (!toast.isActive(limit))
                toast({
                    id: limit,
                    position: 'top',
                    status: 'error',
                    variant: 'subtle',
                    title: 'Antwoord Limiet bereikt',
                })
            return
        }
        let newAnswers = [...answers];
        newAnswers.push({ answer: "", correct: false });
        setAnswers(newAnswers);
    }
    const deleteAnswer = (index) => {
        let newAnswers = [...answers];
        newAnswers.splice(index, 1);
        setAnswers(newAnswers);
    }


    return (
        <HStack>
            {loading ? <Text>Loading...</Text> : <>
                {
                    !isMobile &&
                    <VStack h="92vh">
                        <SidebarSpeurtocht palette={palette} scavengerhunt={huntName} mainButton={() => navigate(`/scavengerhunts/${huntID}/questions`)}>
                            {questions && questions.map((item) => {
                                if (item.question !== "")
                                    return <Button
                                        key={item.name + item.uuid + "side"}
                                        minH="5vh" w="10vw"
                                        borderRadius="15px"
                                        shadow="lg"
                                        bgColor={palette.quaternary}
                                        whiteSpace={'initial'}
                                        onClick={() => editQuestion(item.uuid)}>
                                        {item.question}
                                    </Button>
                            })}
                        </SidebarSpeurtocht>
                    </VStack>
                }
                <Center h="92vh" w={{ base: "100vw", lg: "auto" }}>
                    <Box bgColor={palette.quaternary} width="82vw" h="89vh" p={2} borderRadius="15px" shadow="lg">
                        <Center>
                            <VStack maxWidth="120rem">
                                <VStack w="81vw" pt={4} >
                                    <Center>
                                        <Text paddingTop={{ base: 0, lg: 5 }} fontSize="3xl">Vraag:</Text>
                                    </Center>
                                    <Textarea
                                        bgColor={palette.secondary}
                                        color="white"
                                        borderRadius="15px"
                                        w="64vw" h="9vh"
                                        placeholder='Vraag'
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)} />
                                </VStack>
                                <Center w="81vw">
                                    <VStack w={{ base: "70vw", lg: "60vw" }} bgColor={{ base: palette.quaternary, lg: palette.background }} borderRadius="15px">
                                        <HStack w={{ base: "64vw", lg: "60vw" }} h="6vh" p={{ base: 0, lg: 2 }}>
                                            <Box w={{ base: 0, lg: "1vw" }} />
                                            <Text fontSize="xl">Correct</Text>
                                            {!isMobile && <><Box w="0.2vw" /><Text fontSize="xl">Delete</Text></>}
                                            <Box w="0.7vw" />
                                            <Text fontSize="xl" w={{ base: "40vw", lg: "40.5vw" }}>Antwoorden</Text>
                                            <Spacer />
                                            <Button color="white" h="5vh" w="5vw" bgColor={palette.secondary} borderRadius="15px" onClick={() => addAnswer()}>
                                                <Text fontSize="2xl">+</Text>
                                            </Button>
                                        </HStack>
                                        {answers.map((item, index) => {
                                            return <Answer key={index} palette={palette} answer={item.answer} setAnswer={(e) => updateAnswer(index, e, item.isCorrect)} correct={item.isCorrect} setCorrect={(e) => updateAnswer(index, item.answer, e)} del={() => deleteAnswer(index)} />
                                        })}
                                        <Box h="1vh" />
                                        <HStack w={{ base: "66vw", lg: "45vw" }} h="auto">
                                            <Text fontSize={{ base: "lg", lg: "xl" }} w={{ base: "10vw", lg: "6vw" }}>Hint:</Text>
                                            <Textarea
                                                placeholder='Hint'
                                                minH="5vh"
                                                w={{ base: "55vw", lg: "40vw" }}
                                                borderRadius="15px"
                                                bgColor={palette.primary}
                                                value={hint}
                                                onChange={(e) => setHint(e.target.value)} />
                                        </HStack>
                                        <Box h="1vh" />
                                        <HStack >
                                            <Button w={{ base: "50vw", lg: "45vw" }} h="5vh" bgColor={palette.secondary} color="white" borderRadius="15px" onClick={() => saveQuestion()}>opslaan</Button>
                                            <Button bgColor={palette.tertiary} h="5vh" color="white" borderRadius="15px" onClick={() => deleteQuestion()}>Delete</Button>
                                        </HStack>
                                        <Box h="1vh" />
                                    </VStack>
                                </Center>
                            </VStack>
                        </Center>
                    </Box>
                </Center>
            </>}
        </HStack >
    )
}

export default QuestionForm