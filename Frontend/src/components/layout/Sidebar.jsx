import { Button, ButtonGroup, Stack } from '@chakra-ui/react'

const Sidebar = ({palette}) => {
    
    return(
    <Stack w="8rem">
        <Button bgColor={palette.quaternary}>Speurtocht</Button>        
    </Stack>
    )
}

export default Sidebar