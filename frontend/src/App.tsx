import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleValidation = () => {
    console.log('Navigate to /validate-viewer page');
  };

  const handleEditor = () => {
    console.log('Navigate to /editor page');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header />

      <main style={{
        flex: 1,
        maxWidth: '700px',
        margin: '2rem auto',
        padding: '1rem',
        textAlign: 'center'
      }}>
        <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: '#333' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec blandit
          sit amet enim non tristique. Sed ut turpis ut elit ultricies convallis
          non in augue.
        </p>

        <FileUpload onFileSelected={setSelectedFile} />

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          <button
            onClick={handleValidation}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '0.7rem 1.2rem',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Validate / View File
          </button>

          <button
            onClick={handleEditor}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '0.7rem 1.2rem',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Edit File
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
