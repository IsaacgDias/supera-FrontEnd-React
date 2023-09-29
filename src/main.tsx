import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // Importa o componente principal da aplicação
import './index.css'
import { QueryClient, QueryClientProvider } from 'react-query'; // Importa o React Query e suas dependências

// Cria uma instância do QueryClient para gerenciar as consultas
const queryClient = new QueryClient(); 

// Renderiza o aplicativo React no elemento com o ID 'root'
ReactDOM.createRoot(document.getElementById('root')!).render(
  // Envolvendo o aplicativo em React.StrictMode para realizar verificações adicionais
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
