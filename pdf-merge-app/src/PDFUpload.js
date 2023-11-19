import React from 'react';
import { PDFUpload } from 'react-advanced-pdf-upload';

function PDFUploadComponent({ onUpload }) {
    return (
        <PDFUpload
            multiple
            onUpload={onUpload}
            style={{ width: '500px' }}
        />
    );
}

export default PDFUploadComponent;
