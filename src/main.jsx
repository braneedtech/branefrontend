import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();
import { BrowserRouter as Brane } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Brane>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </Brane>
)
