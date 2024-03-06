import React, { ChangeEvent, useEffect, useState } from 'react';

import axios from 'axios';

export default function Main() {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined); 
  const [fileSize, setFileSize] = useState(0); 
  const [chunks, setChunks] = useState<ArrayBuffer[]>([]); 
  const [domains, setDomains] = useState<string[]>([]);
 
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => { 
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0]; 
    setSelectedFile(file); 
    setFileSize(file.size); 
    setChunks(splitFileIntoChunks(file, 50000)); // 50KB chunks 
  } 
 
  // Define the uploadChunks function
  const uploadChunks = (chunks: ArrayBuffer[], transferId: string, domains: string[]) => {
    // Iterate through the chunks array and upload each chunk to the server using the axios library and domains array
    chunks.forEach((chunk, index) => {
      const domain = domains[index % domains.length];
      axios.post(domain + '/api/upload', {
        transferId,
        chunkIndex: index,
        chunk,
      });
    });

  };

  const initiateTransfer = async () => {
    try {
      const response = await axios.get('/api/init', {
        params: {
          fileSize,
          chunksCount: chunks.length,
        },
      });
      const { transferId, domains } = response.data;
      uploadChunks(chunks, transferId, domains);
    } catch (error) {
      console.error('Error initiating transfer:', error);
    }
  };
 
  function splitFileIntoChunks(file: File, chunkSize: number) { 
    const chunks: ArrayBuffer[] = []; 

    const numChunks = Math.ceil(file.size / chunkSize); 

    //split the received file into multiple chunks based on the chunk size and store it in the chunks array
    for (let i = 0; i < numChunks; i++) { 
      const startIndex = i * chunkSize; 
      const endIndex = Math.min(file.size, startIndex + chunkSize); 
      const chunk = file.slice(startIndex, endIndex);
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        chunks.push(arrayBuffer);
      };
      reader.readAsArrayBuffer(chunk);
    } 
      return chunks;
  } 
 
  return ( 
    <div> 
      <input type="file" onChange={handleFileChange} /> 
      <button onClick={initiateTransfer}>Upload</button> 
    </div> 
  ); 
}
