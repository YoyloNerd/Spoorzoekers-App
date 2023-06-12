
import { Box, Button, HStack, Text } from '@chakra-ui/react'
import React from 'react'

function TableTop({palette}) {
    return (
        <HStack spacing="10rem" borderRadius="15px" m={1} p={2} bgColor={palette.background} >
            <Text>naam </Text>
            <Text pr={35}>Email@email.com</Text>
            <HStack spacing="2em"  pr={3}>
            <Text >
                accept
            </Text>
            <Text>
                delete
            </Text>
            </HStack>
        </HStack>
      )
    }


export default TableTop