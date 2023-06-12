import { Button, HStack, Spacer, Stack, Text } from '@chakra-ui/react'

const SidebarSpeurtocht = ({ palette, children, scavengerhunt, mainButton }) => {

    return (
        <Stack w="13vw" m={5}>
            <Button
                minH="5vh" h="auto"
                borderRadius="15px"
                shadow="lg"
                bgColor={palette.secondary}
                whiteSpace="initial"
                wordBreak={scavengerhunt.includes(" ") ? "break-word" : "break-all"}
                p={2}
                onClick={() => { mainButton() }}>
                <Text fontSize="2xl" color={palette.white}>
                    {scavengerhunt}
                </Text>
            </Button>
            <HStack>
                <Spacer></Spacer>
                <Stack>
                    {children}
                </Stack>
            </HStack>
        </Stack>
    )
}

export default SidebarSpeurtocht