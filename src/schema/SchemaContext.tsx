// src/schema/SchemaContext.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Schema } from '../types/SchemaTypes';
import { adaptSchema } from './schemaAdapter';

interface SchemaContextType {
  schema: Schema | null;
  setSchema: (schema: Schema | null) => void;
  loading: boolean;
  error: string | null;
  loadSchema: (url: string) => Promise<void>;
}

const SchemaContext = createContext<SchemaContextType | undefined>(undefined);

export const SchemaProvider = ({ children }: { children: ReactNode }) => {
  const [schema, setSchema] = useState<Schema | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSchema = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load schema');
      const rawData = await response.json();

      // Adapt the raw schema data to our application's expected format
      const adaptedSchema = adaptSchema(rawData);
      setSchema(adaptedSchema);
    } catch (err: any) {
      setError(err.message);
      setSchema(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SchemaContext.Provider value={{ schema, setSchema, loading, error, loadSchema }}>
      {children}
    </SchemaContext.Provider>
  );
};

export const useSchema = () => {
  const context = useContext(SchemaContext);
  if (!context) throw new Error('useSchema must be used within a SchemaProvider');
  return context;
};
