import './index.css'
import Auth from './(auth)/auth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Pages from './pages/pages';
import LandingPage from './pages/landingPage';
import Profile from './pages/profile';
import ProtectedRoute from './context/protectedRoute';
import { AuthProvider } from './context/authContext.tsx'



function App() {

  return (
<>        
      <Router> 
        <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
         <Route path="*" element={<Navigate to="/dashboard" replace />} />
         <Route path="/auth/:auth" element={<Auth/>} />
          <Route path="/:page" element={<ProtectedRoute><Pages/> </ProtectedRoute> } />
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
          
          </Routes> 
         </AuthProvider>        
       </Router>
    </>
  )
}

export default App
