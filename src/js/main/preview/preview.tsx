import React, { useState, useCallback } from 'react';
import CSInterface from '../../lib/cep/csinterface';
import './preview.scss';

type PreviewData = {
  image: string;
  width: number;
  height: number;
};

const CompositionPreview: React.FC = () => {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const capturePreview = useCallback(() => {
    console.log('Initiating preview capture...');
    setIsLoading(true);
    setError(null);

    const csInterface = new CSInterface();
    csInterface.evalScript('captureCompositionPreview()', (result: string) => {
      console.log('Raw result from captureCompositionPreview:', result);
      try {
        let parsedResult;
        try {
          parsedResult = JSON.parse(result);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.log('Problematic JSON string:', result);
          throw new Error(`Failed to parse result: ${(parseError as Error).message}`); // Cast parseError to Error
        }

        if ('error' in parsedResult) {
          throw new Error(parsedResult.error);
        } else if (parsedResult.success && parsedResult.image) {
          setPreviewData({
            image: parsedResult.image,
            width: parsedResult.width,
            height: parsedResult.height
          });
        } else {
          throw new Error('Unexpected result structure from captureCompositionPreview');
        }
      } catch (e) {
        console.error("Error in capturePreview:", e);
        setError(`Error: ${e instanceof Error ? e.message : String(e)}`);
        setPreviewData(null);
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <div className="composition-preview">
      <h2>Composition Preview</h2>
      <button onClick={capturePreview} disabled={isLoading}>
        {isLoading ? 'Capturing...' : 'Capture Preview'}
      </button>
      {isLoading && <div>Loading preview...</div>}
      {error && <div className="error">{error}</div>}
      {previewData && (
        <div className="preview-image-container">
          <img 
            src={`data:image/jpeg;base64,${previewData.image}`}
            alt="Composition Preview" 
            width={previewData.width} 
            height={previewData.height}
          />
        </div>
      )}
    </div>
  );
};

export default CompositionPreview;