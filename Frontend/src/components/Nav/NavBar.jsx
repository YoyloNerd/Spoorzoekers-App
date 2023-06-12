import { Box, Button, Center, HStack, Image, Link, Spacer, Text, useBreakpointValue, VStack } from '@chakra-ui/react'
import React from 'react'
import CusSpacer from '../util/CusSpacer'
import tcrLogo from '../../assets/tcr-logo-a6a45f6beeaae69f30221d89d2a3e4ba1e2696114d5587459bf6a5dcf3603228.svg'
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from 'react-router'

export default function NavBar({ palette, loggedIn, children }) {
    const curApi = 'http://localhost:5000';
    const logout = process.env.REACT_APP_BASE_URL ? `${curApi}/api/auth/logout` : "/api/auth/logout";
    const useHamburgerMenu = useBreakpointValue(
        {
            base: true,
            lg: false,
        },
    )
    const showingSize = () => {
        return show ? "25vh" : "10vh"
    }
    const [show, setShow] = React.useState(false)
    const navigate = useNavigate();


    return (
        <VStack bgColor={palette.secondary} w="100vw" h={{ base: showingSize(), lg: "8vh" }} spacing={0} shadow="lg">
            <HStack w="100vw" spacing={0}>
                <HStack spacing={0}>
                    <CusSpacer spacing={{ base: "4vw", lg: "2vw" }} />
                    <Box
                        bgColor='white'
                        pt={{ base: 2, lg: 2 }}
                        pb={{ base: 2, lg: 3 }}
                        pl={{ base: 5, lg: 10 }}
                        pr={{ base: 5, lg: 10 }}
                        onClick={() => navigate('/')}>
                        <Image src={tcrLogo} h={{ base: "8vh", lg: "6vh" }} w={{ base: "30vw", lg: "10vw" }} />
                    </Box>
                </HStack>
                {useHamburgerMenu ? <>
                    <Spacer />
                    {show ? <RxCross1 color={palette.primary} size={50} onClick={() => { setShow(false) }} /> : <GiHamburgerMenu color={palette.primary} size={50} onClick={() => { setShow(true) }} />}
                    <Box w="5vw" />
                </> : <>
                    <HStack pos="absolute" zIndex={10} w="100vw"><Center w="100vw">{children}</Center></HStack>
                    <Spacer />
                    {loggedIn ?
                        <Link href={logout}>
                            <Button bgColor={palette.primary}
                                color={palette.secondary}
                                h="4.5vh" w="11vw" borderRadius="15px"
                                fontSize='2xl'>Log Out
                            </Button>
                        </Link>
                        :
                        <Button bgColor={palette.primary}
                            onClick={() => navigate('/login')}
                            color={palette.secondary}
                            h="4.5vh" w="11vw" borderRadius="15px">
                            <Text fontSize='2xl'>Log In</Text>
                        </Button>}
                </>
                }
                {!useHamburgerMenu && <CusSpacer spacing={palette.spacing} />}
            </HStack>
            {useHamburgerMenu ? <>
                {show && <>
                    {children && <Box h="3vh" />}
                    <Center w="100vw">{children}</Center>
                    <Box h="3vh" />
                    {loggedIn ?
                        <Button bgColor={palette.primary
                        } color={palette.secondary} h="5vh" w="50vw" borderRadius="15px">
                            <Link href={logout}>
                                <Text fontSize='2xl'>Log Out</Text>
                            </Link>
                        </Button>
                        :
                        <Link href='/login'>
                            <Button onClick={() => setShow(false)} bgColor={palette.primary} color={palette.secondary} h="5vh" w="50vw" borderRadius="15px">
                                <Text fontSize='2xl'>Log In</Text>
                            </Button>
                        </Link>}
                </>}
            </> : <>
            </>}
        </VStack >
    )
}
