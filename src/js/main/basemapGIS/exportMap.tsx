import * as maplibregl from 'maplibre-gl';

export const exportCurrentView = (
  map: maplibregl.Map,
  exportResolution: number,
  setIsExporting: (isExporting: boolean) => void,
  setProgress: (updater: (prev: number) => number) => void
): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    if (!map) {
      reject(new Error('Map is not initialized'));
      return;
    }

    setIsExporting(true);
    setProgress(() => 0);

    const progressInterval = setInterval(() => {
      setProgress((prev: number) => {
        if (prev < 90) {
          const increment = Math.random() * 10;
          return Math.min(prev + increment, 90);
        }
        return prev;
      });
    }, 300);

    map.once('idle', () => {
      try {
        const originalCanvas = map.getCanvas();
        const originalWidth = originalCanvas.width;
        const originalHeight = originalCanvas.height;

        const scaleFactor = exportResolution;
        const scaledWidth = originalWidth * scaleFactor;
        const scaledHeight = originalHeight * scaleFactor;

        const offScreenCanvas = document.createElement('canvas') as HTMLCanvasElement;
        offScreenCanvas.width = scaledWidth;
        offScreenCanvas.height = scaledHeight;
        const ctx = offScreenCanvas.getContext('2d');

        if (!ctx) {
          throw new Error('Failed to create canvas context.');
        }

        ctx.scale(scaleFactor, scaleFactor);
        ctx.drawImage(originalCanvas, 0, 0);

        offScreenCanvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create image blob'));
            return;
          }

          const reader = new FileReader();
          reader.onloadend = () => {
            clearInterval(progressInterval);
            setProgress(() => 100);
            setIsExporting(false);
            resolve(new Uint8Array(reader.result as ArrayBuffer));
          };
          reader.onerror = () => {
            clearInterval(progressInterval);
            setIsExporting(false);
            reject(new Error('Failed to read image data'));
          };
          reader.readAsArrayBuffer(blob);
        }, 'image/png');
      } catch (error) {
        clearInterval(progressInterval);
        setIsExporting(false);
        setProgress(() => 0);
        reject(error);
      }
    });
  });
};