import { Box, Button, HStack, Text } from '@chakra-ui/react'
import React from 'react'

function UserItem({palette}) {
  return (
    <HStack spacing="10rem" bgColor={palette.secondary} borderRadius="15px" m={1} p={2} color={palette.primary}>
        <Text>naam </Text>
        <Text>Email@email.com</Text>
        <HStack>
        <Button bgColor={palette.primary}>
            accept
        </Button>
        <Button bgColor={palette.tertiary}>
            delete
        </Button>
        </HStack>
    </HStack>
  )
}

export default UserItem