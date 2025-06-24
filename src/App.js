import logo from './logo.svg';
import './App.css';

import { utils, read } from 'xlsx'; // Explicitly import utils and read from xlsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home.js';
import LoginPage from './pages/client_portal/client_login.js';
import ClientPortal from './pages/client_portal/client_portal.js';  
import AdminPortal from './pages/admin_portal/admin_portal.js';

function App() {


  return (
    <div className="App">
      
        <Router>    
               
            <Routes>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/client_login' element={<LoginPage />} />
                <Route exact path='/client_portal' element={<ClientPortal />} />
                <Route exact path='/admin_portal' element={<AdminPortal />} />
            </Routes>

        </Router>
    </div>
  );
}

export default App;
