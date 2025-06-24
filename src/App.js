import logo from './logo.svg';
import './App.css';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home.js';
import LoginPage from './pages/client_portal/client_login.js';
import ClientPortal from './pages/client_portal/client_portal.js';  

function App() {


  return (
    <div className="App">
      
        <Router>    
               
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/client_login' element={<LoginPage />} />
                <Route exact path='/client_portal' element={<ClientPortal />} />
            </Routes>

        </Router>
    </div>
  );
}

export default App;
