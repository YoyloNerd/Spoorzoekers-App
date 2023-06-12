import { Box, Center, HStack, Text, useBreakpointValue } from '@chakra-ui/react'
import React from 'react'

function TableTop({ palette }) {
    const isMobile = useBreakpointValue(
        {
            base: true,
            lg: false,
        },
    )
    return (
        <HStack borderRadius="15px" w={{ base: "74vw", lg: "79vw" }} h="6vh" bgColor={palette.background} >
            <Box w="2vw" />
            <Text fontSize={{ base: "lg", lg: "2xl" }}>Speurtochten</Text>
            <Box w={{ base: "30vw", lg: "58vw" }}/>
        </HStack>
    )
}


export default TableTop