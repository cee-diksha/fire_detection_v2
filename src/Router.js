import React, { Suspense, useContext } from 'react'
import { Route,Routes, Outlet, useLocation } from 'react-router-dom'
import LoadTop from './components/LoadTop/LoadTop.js'
import Loading from './components/Loading/Loading.js'
import { AnimatePresence } from 'motion/react'
import ErrorPage from './pages/Error/Error.js'
import Header from './components/Header/Header.js'
import Settings from './pages/Settings/Settings.js'
import Dashboard from './pages/Dashboard/Dashboard.js'
import RavenLogo from './components/RavenLogo/RavenLogo.js'
import Login from './pages/Login/Login.js'
import SpecificDevice from './pages/SpecificDevice/SpecificDevice.js'
import SpecificDeck from './pages/SpecificDeck/SpecificDeck.js'
import SpecificComp from './pages/SpecificComp/SpecificComp.js'
import { MainContext } from './context/MainContext.js'
import {motion} from 'motion/react'

const MainLayout = () => {
  const {connectedState,isDemo } = useContext(MainContext)
  return (
    <>    
      <main>
        <LoadTop />
        <RavenLogo/>
        <section className='main-content'>
          <Header />
          {connectedState && !isDemo &&(
        <motion.div
          whileHover={{opacity:0.2}}
         animate={connectedState==="connected"?{opacity:0,transition:{delay:3,duration:0.3}}:{opacity:1,transition:{duration:0.3}}} 
         className={`db-modal db-status-${connectedState==="connected"?"on":"off"}`}>
          <div className='db-modal-content'>
            {connectedState === "connecting" && <p>Connecting to Gateway...</p>}
            {connectedState === "connected" && <p>Connected</p>}
            {connectedState === "error" && <p>Error Connecting to Gateway</p>}
            {connectedState === "reconnecting" && <p>Reconnecting to Gateway...</p>}
          </div>
        </motion.div>
      )}
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </section>
      </main>
    </>
  );
};

const Router = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<MainLayout location={location}/>}>
          <Route
            index
            element={
              <Suspense fallback={<Loading />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<Loading />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="login"
            element={
              <Suspense fallback={<Loading />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="info/:id"
            element={
              <Suspense fallback={<Loading />}>
                <SpecificDevice />
              </Suspense>
            }
          />
           <Route
            path="deck/:deck"
            element={
              <Suspense fallback={<Loading />}>
                <SpecificDeck />
              </Suspense>
            }
          />
           <Route
          path="deck/:deck/:comp"
          element={
            <Suspense fallback={<Loading />}>
              <SpecificComp />
            </Suspense>
          }
        />
        </Route>
        <Route path="*" element={<ErrorPage/>}></Route>
      </Routes>
    </AnimatePresence>
  );
};

export default Router;