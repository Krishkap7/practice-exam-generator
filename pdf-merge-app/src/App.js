import React, { useRef, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './App.css'; 


export default function App() {
  const finalizeButtonRef = useRef(null);
  const [finalizeButtonLoading, setFinalizeButtonLoading] = useState(false);
  const [finalizeButtonDisabled, setFinalizeButtonDisabled] = useState(false);

  const downButtonRef = useRef(null);
  const [downButtonLoading, setDownButtonLoading] = useState(false);
  const [downButtonDisabled, setDownButtonDisabled] = useState(false);

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
      // Create a FormData object to send the files only thing that might need to be edeited to account for Data transfer
      const formData = new FormData(); 
      files.forEach((file, index) => {
        formData.append(`file${index}`, file); //ccreates formData() and sends it over to Flas
      });

      // Make a POST request to your Flask server
      const response = await fetch('http://127.0.0.1:5000/upload', {  //////// ADD LNK HERE to send files to server and process
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
      
      const response = await fetch('http://127.0.0.1:5000/upload', { //////// ADD link here that sends files back to front end for downloading
        method: 'GET',
      });
  
      if (response.ok) {
        const blob = await response.blob();
  
        // Create a new File object from the Blob
        // Create a File object to accept the file; only thing that might need to be edeited to account for Data transfer
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
      <div class="button-container">
        <button
          ref={finalizeButtonRef}
          disabled={finalizeButtonLoading || finalizeButtonDisabled}
          onClick={sendFilesToServer}
        >
          {finalizeButtonLoading ? 'Loading...' : 'Submit'}
        </button>

        <button
          ref={downButtonRef}
          disabled={downButtonLoading || downButtonDisabled}
          onClick={handleFetchFile}
        >
          {downButtonLoading ? 'Loading...' : 'Download'}
        </button>
        </div>

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
