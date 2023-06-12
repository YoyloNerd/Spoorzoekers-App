import { Button, ButtonGroup, HStack, Spacer, Stack, Text} from '@chakra-ui/react'

const SidebarSpeurtocht = ({palette}) => {
    
    return(
    <Stack w={{base:"30vw",lg:"15rem"}}>
        <Button bgColor={palette.quaternary}>Speurtocht</Button>        
        <Button bgColor={palette.quaternary}>naam</Button>   
        <HStack>   
            <Spacer></Spacer>
            <Stack  w={{base:"20vw",lg:"13rem"}}>
                <Button minH="7rem" bgColor={palette.quaternary} whiteSpace={'initial'}>wat is het antwoord op deze vraag</Button>        
                <Button minH="7rem" bgColor={palette.quaternary} whiteSpace={'initial'}>wat is het antwoord op deze vraag</Button>     
            </Stack>
        </HStack>
    </Stack>
    )
}

export default SidebarSpeurtocht