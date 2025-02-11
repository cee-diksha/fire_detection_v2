import React, { Suspense } from 'react'
import { Route,Routes, Outlet, useLocation } from 'react-router-dom'
import LoadTop from './components/LoadTop/LoadTop.js'
import Loading from './components/Loading/Loading.js'
import { AnimatePresence } from 'motion/react'
import ErrorPage from './pages/Error/Error.js'
import Header from './components/Header/Header.js'
import Settings from './pages/Settings/Settings.js'
import Dashboard from './pages/Dashboard/Home.js'

const MainLayout = () => {
  
  return (
    <>    
      <main className="page">
        <LoadTop />
        <Header />
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
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
        </Route>
        <Route path="*" element={<ErrorPage/>}></Route>
      </Routes>
    </AnimatePresence>
  );
};

export default Router;