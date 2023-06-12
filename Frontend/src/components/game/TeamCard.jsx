import { Box, Button, Center, HStack, Spacer, Text, VStack } from '@chakra-ui/react'
import React from 'react'

function TeamCard({ palette, name, playerCount, completed, total }) {
    return (
        <HStack
            bgColor={palette.secondary}
            p={2}
            w="100%" minH={"15vh"} borderRadius="15px">
            <HStack
                bgColor={palette.primary}
                minW={"10vw"}
                w={`${completed / total * 80 + 20}%`}
                minH={"14vh"} borderRadius="15px">
                <Box w="1vw" />
                <VStack>
                    <Text fontSize="4xl" w={"11vw"} color={palette.secondary} whiteSpace="initial">{`${name}: `}</Text>
                    <Text fontSize="4xl" w={"11vw"} color={palette.secondary} whiteSpace="initial">{`${playerCount} players`}</Text>
                    <Text fontSize="4xl" w={"11vw"} color={palette.secondary} whiteSpace="initial">{`${completed}/${total}`}</Text>
                </VStack>
                <Spacer />
                {completed === total && <Text fontSize="4xl" color={palette.secondary} whiteSpace="initial">Completed</Text>}
                <Box w="1vw" />
            </HStack>
        </HStack>
    )
}

export default TeamCard