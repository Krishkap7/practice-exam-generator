import React, { useRef, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './App.css'; 


export default function App() {
  const finalizeButtonRef = useRef(null);
  const [finalizeButtonLoading, setFinalizeButtonLoading] = useState(false);
  const [finalizeButtonDisabled, setFinalizeButtonDisabled] = useState(false);
  const [files, setFiles] = useState([]);

  const onDrop = useCallback(acceptedFiles => {
    // Append new files to the existing files
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]); // combines prev Files with input acceptedFiles to re create prevFiles
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'application/pdf',
    multiple: true
  });

  const sendFilesToServer = async () => {
    try {
      // Create a FormData object to send the files
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`file${index}`, file); //ccreates formData() and sends it over to Flas
      });

      // Make a POST request to your Flask server
      const response = await fetch('http://your-server-url.com/upload', {  //////// ADD LNK HERE
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Files uploaded successfully');
      } else {
        console.error('Failed to upload files');
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  return (
    <>
      <h1>Upload Your PDFs</h1>
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
        onClick={sendFilesToServer}
      >
        {finalizeButtonLoading ? 'Loading...' : 'Finalize'}
      </button>
    </>
  );
}
