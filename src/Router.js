import React, { Suspense } from 'react'
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

const MainLayout = () => {
  
  return (
    <>    
      <main>
        <LoadTop />
        <RavenLogo/>
        <section className='main-content'>
          <Header />
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
        </Route>
        <Route path="*" element={<ErrorPage/>}></Route>
      </Routes>
    </AnimatePresence>
  );
};

export default Router;