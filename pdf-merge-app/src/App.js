import React, { useRef, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './App.css'; // Add this line at the top of your file


export default function App() {
  const finalizeButtonRef = useRef(null);
  const [finalizeButtonLoading, setFinalizeButtonLoading] = useState(false);
  const [finalizeButtonDisabled, setFinalizeButtonDisabled] = useState(false);
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    // Append new files to the existing files
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'application/pdf',
    multiple: true
  });

  // Rest of your component logic...

  return (
    <>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <p>Drag and drop PDF files here, or click to select files</p>
      </div>
      {files.length > 0 && (
        <ul className="file-list">
          {files.map(file => (
            <li key={file.path}>{file.name} - {file.size} bytes</li>
          ))}
        </ul>
      )}
      <button
        ref={finalizeButtonRef}
        disabled={finalizeButtonLoading || finalizeButtonDisabled}
      >
        {finalizeButtonLoading ? 'Loading...' : 'Finalize'}
      </button>
    </>
  );
}
