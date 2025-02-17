import { BrowserRouter } from 'react-router-dom';
import './global.css';
import Router from './Router';
import { MainContextProvider } from './utils/MainContext';



function App() {
  return ( 
    <BrowserRouter>
      <MainContextProvider>
        <Router/>
      </MainContextProvider> 
    </BrowserRouter>
  );
}

export default App;
