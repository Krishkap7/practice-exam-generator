import React, { useRef, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './App.css'; 


export default function App() {
  const finalizeButtonRef = useRef(null);
  const [finalizeButtonLoading, setFinalizeButtonLoading] = useState(false);
  const [finalizeButtonDisabled, setFinalizeButtonDisabled] = useState(false);
  const [files, setFiles] = useState([]);
  const [fetchedFile, setFetchedFile] = useState(null);


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

  const handleFetchFile = async () => {
    try {
      // Make a GET request
      const response = await fetch('http://your-server-url.com/fetch-file', {
        method: 'GET',
      });
  
      if (response.ok) {
        const blob = await response.blob();
  
        // Create a new File object from the Blob
        const NewFIle = new File([blob], 'fetchedFile.pdf', {
          type: 'application/pdf',
        });

        setFetchedFile(NewFIle);

        console.log('File fetched successfully');
      } else {
        console.error('Failed to fetch file');
      }
    } catch (error) {
      console.error('An error occurred while fetching the file', error);
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

      {fetchedFile && (
        <div>
          <a
            href={URL.createObjectURL(fetchedFile)}
            download={fetchedFile.name}
          >
            Download Fetched File
          </a>
        </div>
      )}

    </>
  );
}
