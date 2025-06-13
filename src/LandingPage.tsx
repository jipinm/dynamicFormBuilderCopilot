import { useState } from 'react';
import { useSchema } from './schema/SchemaContext';
import { validateSchema } from './schema/validateSchema';
import { loadSchemaByName } from './schema/loadSchema';
import SchemaFormRenderer from './form/SchemaFormRenderer';
import { useTheme, type ThemeType } from './theme/ThemeContext';
import './form/form.css';

const SCHEMA_FILES = [
  'demographics-form-schema.json',
  'medication-form-schema.json',
  'lab-results-form-schema.json',
  'adverse-event-form-schema.json',
  'symptom-diary-form-schema.json',
];

export default function LandingPage() {
  const { schema, setSchema, loading } = useSchema();
  const { theme, setTheme, colorMode, toggleColorMode } = useTheme();
  const [selected, setSelected] = useState('');
  const [validation, setValidation] = useState<{ valid: boolean; errors?: string[] } | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelected(name);
    if (!name) return;
    try {
      const loaded = await loadSchemaByName(name);
      setSchema(loaded);
      setValidation(validateSchema(loaded));
    } catch (err: any) {
      setSchema(null);
      setValidation({ valid: false, errors: [err.message] });
    }
  };
  
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as ThemeType);
  };

  const handleSave = (values: Record<string, any>) => {
    console.log('Saving form data:', values);
    setFormData(values);
    alert('Form data saved!');
  };

  const handleSubmit = (values: Record<string, any>) => {
    console.log('Submitting form data:', values);
    setFormData(values);
    alert('Form submitted successfully!');
  };

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '1rem auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      padding: '0 1rem'
    }}>
      {/* Title Bar */}
      <div style={{ 
        textAlign: 'center', 
        background: colorMode === 'light' 
          ? 'linear-gradient(135deg, #ffffff, #f8f9fa)'
          : 'linear-gradient(135deg, #1f2937, #111827)',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: colorMode === 'light'
          ? '0 10px 30px rgba(67, 97, 238, 0.1)'
          : '0 10px 30px rgba(0, 0, 0, 0.3)',
        animation: 'fadeIn 0.6s ease-out',
        color: colorMode === 'light' ? '#212529' : '#f3f4f6'
      }}>
        <h2 style={{ 
          color: colorMode === 'light' ? '#4361ee' : '#6366f1', 
          fontWeight: 700, 
          fontSize: '2.2rem', 
          margin: 0,
          position: 'relative',
          display: 'inline-block'
        }}>
          Dynamic Form Builder
          <span style={{
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            height: '3px',
            width: '80px',
            background: colorMode === 'light'
              ? 'linear-gradient(90deg, #4361ee, #4cc9f0)'
              : 'linear-gradient(90deg, #6366f1, #22d3ee)',
            borderRadius: '3px'
          }}></span>
        </h2>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: '2rem',
      }}>
        {/* Left Control Panel */}
        <div style={{ 
          flex: '1',
          minWidth: '280px',
          maxWidth: '360px',
          textAlign: 'center',
          background: colorMode === 'light' 
            ? 'linear-gradient(135deg, #ffffff, #f8f9fa)'
            : 'linear-gradient(135deg, #1f2937, #111827)',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: colorMode === 'light'
            ? '0 10px 30px rgba(67, 97, 238, 0.1)'
            : '0 10px 30px rgba(0, 0, 0, 0.3)',
          height: 'fit-content',
          alignSelf: 'flex-start',
          position: 'sticky',
          top: '1rem'
        }}>
          <h3 style={{ 
            color: colorMode === 'light' ? '#4361ee' : '#6366f1', 
            fontWeight: 600, 
            fontSize: '1.4rem',
            marginTop: 0,
            marginBottom: '1.5rem'
          }}>
            Demo Controls
          </h3>
          
          <label 
            htmlFor="schema-select" 
            style={{ 
              color: colorMode === 'light' ? '#343a40' : '#d1d5db', 
              fontWeight: 500, 
              display: 'block',
              marginBottom: '0.75rem',
              fontSize: '1.1rem'
            }}
          >
            Select a form schema:
          </label>
          <select 
            id="schema-select" 
            value={selected} 
            onChange={handleSelect} 
            style={{ 
              margin: '0.5rem auto 1.5rem',
              padding: '12px 20px',
              borderRadius: '8px',
              border: colorMode === 'light' 
                ? '1px solid rgba(0,0,0,0.1)' 
                : '1px solid rgba(255,255,255,0.1)',
              fontSize: '1rem',
              width: '100%',
              appearance: 'none',
              backgroundImage: colorMode === 'light'
                ? `url("data:image/svg+xml;utf8,<svg fill='%234361ee' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`
                : `url("data:image/svg+xml;utf8,<svg fill='%236366f1' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              boxShadow: colorMode === 'light'
                ? '0 2px 6px rgba(0,0,0,0.05)'
                : '0 2px 6px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              backgroundColor: colorMode === 'light' ? '#ffffff' : '#374151',
              color: colorMode === 'light' ? '#212529' : '#f3f4f6'
            }}
          >
            <option value="">-- Choose Schema --</option>
            {SCHEMA_FILES.map((file) => (
              <option key={file} value={file}>{file.replace('-form-schema.json', '').replace(/-/g, ' ')}</option>
            ))}
          </select>

          <label 
            htmlFor="theme-select" 
            style={{ 
              color: colorMode === 'light' ? '#343a40' : '#d1d5db', 
              fontWeight: 500, 
              display: 'block',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
              fontSize: '1.1rem'
            }}
          >
            Select Theme:
          </label>
          <select 
            id="theme-select" 
            value={theme} 
            onChange={handleThemeChange} 
            style={{ 
              margin: '0.5rem auto 1.5rem',
              padding: '12px 20px',
              borderRadius: '8px',
              border: colorMode === 'light' 
                ? '1px solid rgba(0,0,0,0.1)' 
                : '1px solid rgba(255,255,255,0.1)',
              fontSize: '1rem',
              width: '100%',
              appearance: 'none',
              backgroundImage: colorMode === 'light'
                ? `url("data:image/svg+xml;utf8,<svg fill='%234361ee' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`
                : `url("data:image/svg+xml;utf8,<svg fill='%236366f1' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              boxShadow: colorMode === 'light'
                ? '0 2px 6px rgba(0,0,0,0.05)'
                : '0 2px 6px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              backgroundColor: colorMode === 'light' ? '#ffffff' : '#374151',
              color: colorMode === 'light' ? '#212529' : '#f3f4f6'
            }}
          >
            <option value="simple">Simple (Minimal)</option>
            <option value="modern">Modern (Styled)</option>
          </select>

          <div 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1.5rem',
              marginBottom: '1.5rem'
            }}
          >
            <label 
              htmlFor="color-mode-toggle" 
              style={{ 
                color: colorMode === 'light' ? '#343a40' : '#d1d5db', 
                fontWeight: 500,
                fontSize: '1.1rem'
              }}
            >
              {colorMode === 'light' ? 'Light Mode' : 'Dark Mode'}
            </label>
            
            <button 
              id="color-mode-toggle"
              onClick={toggleColorMode} 
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '30px',
                borderRadius: '15px',
                backgroundColor: colorMode === 'light' ? '#f8f9fa' : '#374151',
                border: '1px solid rgba(0,0,0,0.1)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.3s ease',
                padding: 0
              }}
              aria-label={colorMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <div 
                style={{ 
                  position: 'absolute',
                  left: colorMode === 'light' ? '4px' : 'calc(100% - 26px)',
                  top: '3px',
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  backgroundColor: colorMode === 'light' ? '#4361ee' : '#6366f1',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '12px'
                }}
              >
                {colorMode === 'light' ? '☀️' : '🌙'}
              </div>
            </button>
          </div>
          
          {loading && (
            <div style={{ 
              color: colorMode === 'light' ? '#4361ee' : '#6366f1', 
              fontWeight: 500,
              background: colorMode === 'light' 
                ? 'rgba(67, 97, 238, 0.05)'
                : 'rgba(99, 102, 241, 0.1)',
              padding: '0.75rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: colorMode === 'light'
                  ? '2px solid rgba(67, 97, 238, 0.3)'
                  : '2px solid rgba(99, 102, 241, 0.3)',
                borderTopColor: colorMode === 'light' ? '#4361ee' : '#6366f1',
                animation: 'spin 1s linear infinite'
              }}></div>
              Loading schema...
            </div>
          )}
          
          {validation && !validation.valid && (
            <div style={{ 
              color: colorMode === 'light' ? '#e5383b' : '#ef4444', 
              background: colorMode === 'light'
                ? 'rgba(229, 56, 59, 0.05)'
                : 'rgba(239, 68, 68, 0.1)',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginTop: '0.75rem',
              fontWeight: 500,
              borderLeft: colorMode === 'light'
                ? '3px solid #e5383b'
                : '3px solid #ef4444',
              textAlign: 'left'
            }}>
              Schema error: {validation.errors?.join(', ')}
            </div>
          )}
        </div>
        
        {/* Right Form Area */}
        <div style={{ 
          flex: '3',
          minWidth: '280px',
        }}>
          {schema && validation?.valid ? (
            <SchemaFormRenderer 
              formData={formData} 
              onSave={handleSave} 
              onSubmit={handleSubmit} 
            />
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              borderRadius: '12px',
              background: colorMode === 'light' 
                ? 'linear-gradient(135deg, #ffffff, #f8f9fa)'
                : 'linear-gradient(135deg, #1f2937, #111827)',
              boxShadow: colorMode === 'light'
                ? '0 10px 30px rgba(67, 97, 238, 0.1)'
                : '0 10px 30px rgba(0, 0, 0, 0.3)',
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1rem',
              }}>
                📋
              </div>
              <h3 style={{
                color: colorMode === 'light' ? '#4361ee' : '#6366f1',
                fontSize: '1.5rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}>
                Select a Form Schema
              </h3>
              <p style={{
                color: colorMode === 'light' ? '#495057' : '#9ca3af',
                fontSize: '1.1rem',
                maxWidth: '500px',
                margin: '0 auto',
              }}>
                Choose a schema from the dropdown menu on the left to render a dynamic form.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .main-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
