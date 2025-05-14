
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check if Supabase environment variables are missing
const missingSupabaseEnvVars = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a wrapper component to show a warning banner if needed
const AppWithWarningBanner = () => (
  <>
    {missingSupabaseEnvVars && (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '10px',
        backgroundColor: '#fff3cd',
        color: '#856404',
        textAlign: 'center',
        zIndex: 9999,
        fontSize: '14px'
      }}>
        ⚠️ Supabase environment variables are missing. The app is running in development mode with limited functionality.
      </div>
    )}
    <App />
  </>
);

createRoot(document.getElementById("root")!).render(<AppWithWarningBanner />);
