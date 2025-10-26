import React, { useState } from 'react';

type FileUploadProps = {
  onFileSelected: (file: File | null) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected }) => {
  const [fileName, setFileName] = useState<string>('No file chosen');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    onFileSelected(file);
    setFileName(file ? file.name : 'No file chosen');
  };

  return (
    <div style={{ margin: '1rem 0', textAlign: 'center' }}>
      <input
        type="file"
        id="fitFileInput"
        accept=".fit"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <label
        htmlFor="fitFileInput"
        style={{
          backgroundColor: '#004d99',
          color: 'white',
          padding: '0.6rem 1.2rem',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Choose .FIT File
      </label>
      <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>{fileName}</p>
    </div>
  );
};

export default FileUpload;
