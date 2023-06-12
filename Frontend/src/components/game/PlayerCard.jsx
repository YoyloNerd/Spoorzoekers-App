import { Box, Button, Center, Text, VStack } from '@chakra-ui/react'
import React from 'react'

function PlayerCard({ palette, name, index, removePlayer }) {
    return (
        <Button
            bgColor={index % 2 ? palette.primary : palette.secondary}
            minH={"10vh"} borderRadius="15px"
            onClick={() => removePlayer()}>
            <Center minH={"10vh"}>
                <Text fontSize="4xl" color={index % 2 ? palette.secondary : palette.primary} whiteSpace="initial">{name}</Text>
            </Center>

        </Button>
    )
}

export default PlayerCard