import React, { useState } from "react";
import { evalTS } from "../lib/utils/bolt";
import "./main.scss";
import BasemapGIS from "./basemapGIS/basemapGIS";

// Import the importPNG function
const importPNG = (params: { fileName: string, extensionPath: string }) => {
  return evalTS("importPNG", params);
};

// New component for the Import Photo tab
const ImportPhoto = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        console.log("Attempting to import PNG...");
        const filePath = (file as any).path;
        
        if (!filePath) {
          throw new Error("Unable to get file path. Please select the file again.");
        }

        const result = await importPNG({
          fileName: filePath,
          extensionPath: ''
        });

        console.log("Import result:", result);
        if (result.includes("successfully")) {
          alert("PNG imported successfully");
        } else if (!result.includes("AVItem is undefined")) {
          alert("Failed to import PNG: " + result);
        }
      } catch (error) {
        console.error("Error in handleUpload:", error);
        alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  };

  return (
    <div>
      <h3>Select a PNG file to import into After Effects</h3>
      <input type="file" accept=".png" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Import PNG to AE
      </button>
    </div>
  );
};

const Main = () => {
  const [activeTab, setActiveTab] = useState<'photo' | 'gis'>('photo');

  return (
    <div className="app">
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'photo' ? 'active' : ''}`}
          onClick={() => setActiveTab('photo')}
        >
          Import Photo
        </button>
        <button 
          className={`tab ${activeTab === 'gis' ? 'active' : ''}`}
          onClick={() => setActiveTab('gis')}
        >
          Import GIS File
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'photo' ? <ImportPhoto /> : <BasemapGIS />}
      </div>
    </div>
  );
};

export default Main;
