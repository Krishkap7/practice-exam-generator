import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileChange = (event) => {
        setSelectedFiles([...event.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await axios.post('http://your-backend-endpoint/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handle the response accordingly
            // Assuming the response contains the merged PDF file
            downloadMergedPDF(response.data);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    const downloadMergedPDF = (data) => {
        // Implement function to download the merged PDF
        // This depends on how your backend sends the merged PDF
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" multiple onChange={handleFileChange} />
            <button type="submit">Upload and Merge</button>
        </form>
    );
}

export default FileUpload;
