import { Box, Button, HStack, Text, IconButton, useBreakpointValue, Spacer } from '@chakra-ui/react'
import React from 'react'
import { AiOutlineEdit, AiFillDelete } from "react-icons/ai";

function SpeurtochtItem({ palette, name, edit, del }) {
  const isMobile = useBreakpointValue(
    {
      base: true,
      lg: false,
    },
  )
  return (
    <HStack borderRadius="15px" w={{ base: "74vw", lg: "79vw" }} minH="6vh" bgColor={palette.secondary} spacing={0} color={palette.primary}>
      <Box w="2vw" />
      <Text fontSize={{ base: "lg", lg: "2xl" }} w={{ base: "46vw", lg: "50vw" }} minH="3vh" whiteSpace={'initial'}>{name}</Text>
      <Spacer />
      <Spacer />
      <Spacer />
      <Spacer />
      <Spacer />
      <Spacer />
      <IconButton
        bgColor={palette.primary}
        h="5vh" w="5vh"
        color="black"
        onClick={() => { edit() }}
        icon={<AiOutlineEdit size={isMobile ? 30 : 35} />} />
      <Spacer />
      <Spacer />
      <IconButton
        bgColor={palette.tertiary}
        h="5vh" w="5vh"
        color="black"
        onClick={() => { del() }}
        icon={<AiFillDelete size={isMobile ? 30 : 40} />} />
        <Spacer />
    </HStack>
  )
}

export default SpeurtochtItem