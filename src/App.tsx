import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from './store/hooks'
import Layout from './components/layout'
import Login from './containers/login'
import Dashboard from './containers/dashboard'
import Profile from './containers/profile'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  return (
    <Router>
      <Layout>
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
          />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
