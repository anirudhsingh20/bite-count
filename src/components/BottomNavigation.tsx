import { Home, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const BottomNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 sm:max-w-md sm:mx-auto">
      <div className="flex justify-around">
        <button
          onClick={() => navigate('/dashboard')}
          className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors ${
            isActive('/dashboard') 
              ? 'text-blue-600' 
              : 'text-gray-400'
          }`}
        >
          <Home size={20} />
          <span className={`text-xs mt-1 ${
            isActive('/dashboard') ? 'text-blue-600' : 'text-gray-400'
          }`}>Dashboard</span>
        </button>
        
        <button
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors ${
            isActive('/profile') 
              ? 'text-blue-600' 
              : 'text-gray-400'
          }`}
        >
          <User size={20} />
          <span className={`text-xs mt-1 ${
            isActive('/profile') ? 'text-blue-600' : 'text-gray-400'
          }`}>Profile</span>
        </button>
      </div>
    </div>
  )
}

export default BottomNavigation
