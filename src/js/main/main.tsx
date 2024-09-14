import React, { useState } from "react";
import { evalTS } from "../lib/utils/bolt";
import "./main.scss";

// Import the importPNG function
const importPNG = (params: { fileName: string, extensionPath: string }) => {
  return evalTS("importPNG", params);
};

const Main = () => {
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
          extensionPath: '' // Add this line with an appropriate value if needed
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
    <div className="app">
      <h3>Select a PNG file to import into After Effects</h3>
      <input type="file" accept=".png" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Import PNG to AE
      </button>
    </div>
  );
};

export default Main;
