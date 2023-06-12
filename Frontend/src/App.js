import { useEffect, useReducer, useState } from 'react'
import curColorPalette from './utils/colorScheme/curColorPalette';
import { Button, ChakraProvider, extendTheme, Link, Text } from '@chakra-ui/react'
import { BrowserRouter as Router, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import axios from 'axios';
import { isMobile } from 'react-device-detect';
//navbar
import NavBar from './components/Nav/NavBar';

//pages
import Login from './pages/Login';
import AdminDash from './pages/AdminDash';
import ScavengerHunt from './pages/Teacher/ScavengerHunt';
import Questions from './pages/Teacher/Questions';
import QuestionForm from './pages/Teacher/QuestionForm';
import JoinGamePage from './pages/Game/JoinGamePage';

function App() {
  axios.defaults.baseURL = 'http://localhost:5000';
  const palette = curColorPalette();

  const [loggedIn, setLoggedIn] = useReducer((prev, newState) => { return prev !== newState ? newState : prev }, false);
  const [loading, setLoading] = useState(true);

  function RequireAuth() {
    while (loading) { }
    if (!loggedIn) {
      return <Navigate to="/login" />;
    }
    return <Outlet />
  }

  useEffect(() => {
    axios.get('/api/auth/loggedin', { withCredentials: true }).then(res => {
      console.log(res.data);
      if (res.data.loggedIn)
        setLoggedIn(true);
    }).then(() => setLoading(false));
  }, [])



  return (
    <ChakraProvider theme={extendTheme({ styles: { global: (props) => ({ body: { bg: palette.background } }) } })}>
      {loading ? <Text>Loading...</Text> : <>
        <Router>
          <NavBar palette={palette} centered loggedIn={loggedIn}>
            {loggedIn && <Link href='/scavengerhunts'>
              <Text color={palette.primary} fontSize={{ base: "lg", lg: "xl" }}>
                Speurtochten
              </Text>
            </Link>}
          </NavBar>
          <Routes>
            <Route path="login" element={<Login palette={palette} loggedIn={loggedIn} />} />

            <Route path="admin" element={<RequireAuth />} >
              <Route index element={<AdminDash palette={palette} />} />
            </Route>

            <Route path="scavengerhunts" element={<RequireAuth />}>
              <Route index element={<ScavengerHunt palette={palette}></ScavengerHunt>} />
              <Route path=":huntID/questions" element={<Questions palette={palette} />} />
              <Route path=":huntID/questions/:uuid" element={<QuestionForm palette={palette} />} />
            </Route>

            <Route path="game" element={<RequireAuth />}>
              <Route path=":gameID" element={<JoinGamePage palette={palette} />} />
            </Route>

            <Route path="/" element={<Text color='black'>Home</Text>} />
            <Route path="*" element={<Text color='black'>404: Page not found</Text>} />
          </Routes>
        </Router>
      </>}
    </ChakraProvider >
  )
}

export default App