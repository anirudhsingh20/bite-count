import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default ProtectedRoute
