
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import './index.css';
import axios from 'axios';

// API environment check
const missingApiUrl = !import.meta.env.VITE_API_URL;

// Create a QueryClient for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Create a wrapper component to show a warning banner if needed
const AppWithWarningBanner = () => (
  <>
    {missingApiUrl && (
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
        ⚠️ API URL environment variable is missing. The app will attempt to connect to localhost:5000.
      </div>
    )}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </>
);

createRoot(document.getElementById("root")).render(<AppWithWarningBanner />);
