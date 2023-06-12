import { Box, Center, Grid, GridItem, HStack, Input, Spacer, VStack } from "@chakra-ui/react"
import TableTop from "../components/admindash/TableTop"
import UserItem from "../components/admindash/UserItem"

const AdminDash = ({palette}) => {
    return(
        <Center>
            <Box bgColor={palette.quaternary} width="60rem" p={2} borderRadius="15px">
                <HStack pr={140}>
                    <Spacer/>
                    <Input placeholder='search' size='lg' width={400}/>
                </HStack>
                <VStack>
                    <TableTop palette={palette}></TableTop>
                    <UserItem palette={palette}></UserItem>
                    <UserItem palette={palette}></UserItem>
                    <UserItem palette={palette}></UserItem>
                    <UserItem palette={palette}></UserItem>
                </VStack>
            </Box>
        </Center>
    )
}

export default AdminDash