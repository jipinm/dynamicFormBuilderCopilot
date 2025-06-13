import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SchemaProvider } from './schema/SchemaContext';
import { FormStateProvider } from './form/formState/FormStateContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SchemaProvider>
      <FormStateProvider>
        <App />
      </FormStateProvider>
    </SchemaProvider>
  </StrictMode>,
)
