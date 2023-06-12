import { Flex, Image, Link } from '@chakra-ui/react'
import microsoftButton from '../assets/ms-symbollockup_signin_light.svg'
import { Navigate } from 'react-router-dom';

function Login({ palette, loggedIn }) {
    const curApi = 'http://localhost:5000';
    const MicrosoftRoute = process.env.REACT_APP_BASE_URL ? `${curApi}/api/auth/microsoft` : "/api/auth/microsoft";

    if (loggedIn) {
        return <Navigate to="/scavengerhunts" />
    }

    return (
        <Flex alignItems={'center'} justifyContent={'center'} h="92vh">
            <Flex
                bgColor={palette.quaternary}
                h="85vh" w="80vw"
                borderRadius="15px"
                alignItems={'center'} justifyContent={'center'}>
                <Link href={MicrosoftRoute}>
                    <Image src={microsoftButton} alt="Microsoft login" h={{base:"50vh",lg:"5vh"}} w={{base:"75vw",lg:"15vw"}} />
                </Link>
            </Flex>
        </Flex>
    )
}

export default Login