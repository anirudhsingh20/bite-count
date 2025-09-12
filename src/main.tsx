import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import LoadingSpinner from './components/LoadingSpinner'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <App />
        <Toaster position='bottom-right' />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
