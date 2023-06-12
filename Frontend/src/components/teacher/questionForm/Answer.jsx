import { Box, Checkbox, Text, HStack, Input, Center, VStack, Textarea, IconButton, useBreakpointValue } from '@chakra-ui/react'
import React from 'react'
import { AiFillDelete, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

function Answer({ palette, answer, setAnswer, correct, setCorrect, del }) {
  const isMobile = useBreakpointValue(
    {
      base: true,
      lg: false,
    },
  )

  return (
    <HStack w={{ base: "66vw", lg: "58vw" }}>
      <Box w={{ base: "4vw", lg: "1vw" }} />
      {isMobile ? <VStack>
        <Box borderRadius="10px" p={2} h="5vh" w="5vh" bgColor={palette.secondary} alignItems="center" justifyContent="center" onClick={() => { setCorrect(!correct) }}>
          {correct ? <AiOutlineCheck size={25} color={palette.white} /> : <AiOutlineClose size={25} color={palette.white} />}
        </Box>
        <IconButton
          bgColor={palette.tertiary}
          h="5vh" w="5vh"
          color="black"
          onClick={() => { del() }}
          icon={<AiFillDelete size={30} />} />
      </VStack> : <HStack>
        <Box borderRadius="10px" p={2} h="5vh" w="5vh" bgColor={palette.secondary} alignItems="center" justifyContent="center" onClick={() => { setCorrect(!correct) }}>
          {correct ? <AiOutlineCheck size={32} color={palette.white} /> : <AiOutlineClose size={32} color={palette.white} />}
        </Box>
        <Box w="0.5vw" />
        <IconButton
          bgColor={palette.tertiary}
          h="5vh" w="5vh"
          color="black"
          onClick={() => { del() }}
          icon={<AiFillDelete size={40} />} />
      </HStack>}
      <Box w="1vw" />
      <Textarea
        placeholder='Antwoord'
        size='lg'
        width="53vw"
        bgColor={palette.primary}
        value={answer}
        onChange={(e) => { setAnswer(e.target.value) }}
        borderRadius="15px" />

    </HStack>
  )
}

export default Answer