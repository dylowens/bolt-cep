import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './basemapGIS.scss';
import { exportCurrentView } from './exportMap';
import { evalTS } from '../../lib/utils/bolt';

// Replace with your actual MapTiler API key
const MAPTILER_API_KEY = process.env.REACT_APP_MAPTILER_API_KEY || 'ALtTyyha1BGAljUUGaE9';

declare const app: { project: { file: { parent: { fsName: string } } } };

declare const FileWriter: any;

const basemapStyles: { name: string; style: string }[] = [
  { name: 'Bright', style: `https://api.maptiler.com/maps/bright/style.json?key=${MAPTILER_API_KEY}` },
  { name: 'Dark Matter', style: `https://api.maptiler.com/maps/dark-matter/style.json?key=${MAPTILER_API_KEY}` },
  { name: 'Positron', style: `https://api.maptiler.com/maps/positron/style.json?key=${MAPTILER_API_KEY}` },
  { name: 'Basic', style: `https://api.maptiler.com/maps/basic/style.json?key=${MAPTILER_API_KEY}` },
  { name: 'Satellite', style: `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_API_KEY}` },
  { name: 'Terrain', style: `https://api.maptiler.com/maps/terrain/style.json?key=${MAPTILER_API_KEY}` },
];

const BasemapGIS: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [activeBasemap, setActiveBasemap] = useState(basemapStyles[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [exportResolution, setExportResolution] = useState(2); // Default to 2x for high-res export
  const [progress, setProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current!,
      style: activeBasemap.style,
      center: [8.5456, 47.3739],
      zoom: 11,
      bearing: 0,
      pitch: 0,
      interactive: true,
    });

    const resizeMap = () => {
      if (map.current && mapContainer.current) {
        map.current.resize();
      }
    };

    window.addEventListener('resize', resizeMap);

    return () => {
      window.removeEventListener('resize', resizeMap);
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (map.current) {
      const currentCenter = map.current.getCenter();
      const currentZoom = map.current.getZoom();
      const currentBearing = map.current.getBearing();
      const currentPitch = map.current.getPitch();

      map.current.setStyle(activeBasemap.style);

      map.current.once('style.load', () => {
        map.current?.jumpTo({
          center: currentCenter,
          zoom: currentZoom,
          bearing: currentBearing,
          pitch: currentPitch,
        });

        const nav = new maplibregl.NavigationControl({
          visualizePitch: true,
        });
        map.current?.addControl(nav, 'top-right');
      });
    }
  }, [activeBasemap]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const firstResult = data[0];
        const lng = parseFloat(firstResult.lon);
        const lat = parseFloat(firstResult.lat);
        map.current?.flyTo({ center: [lng, lat], zoom: 14, speed: 1.2 });
      } else {
        alert('Location not found!');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
      alert('An error occurred while searching for the location.');
    }
  };
const handleExport = async () => {
  if (map.current) {
    try {
      const imageData = await exportCurrentView(map.current, exportResolution, setIsExporting, setProgress);
      
      const result = await evalTS('aeft', `
        const filePath = app.project.file.parent.fsName + "/exported_map.png";
        const writeResult = writeFile(filePath, ${JSON.stringify(Array.from(imageData))});
        if (writeResult.startsWith("Success")) {
          createBasemapComp(filePath);
        }
        writeResult; // Return the result
      `);

      if (result.startsWith("Success")) {
        alert(result);
      } else {
        throw new Error(result);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`Error during export: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  }
};

  return (
    <div className="basemap-gis">
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location..."
        />
        <button type="submit">Search</button>
      </form>

      <div className="map-container">
        <div ref={mapContainer} className="maplibregl-map" />
      </div>

      <div className="basemap-controls">
        <div className="basemap-options">
          <label htmlFor="basemapSelector">Basemap:</label>
          <select
            id="basemapSelector"
            value={activeBasemap.name}
            onChange={(e) =>
              setActiveBasemap(basemapStyles.find((style) => style.name === e.target.value)!)
            }
          >
            {basemapStyles.map((style) => (
              <option key={style.name} value={style.name}>
                {style.name}
              </option>
            ))}
          </select>
        </div>

        <div className="slider-controls">
          <label htmlFor="zoomSlider">
            Zoom: <span id="zoomValue">11.0</span>
          </label>
          <input
            type="range"
            id="zoomSlider"
            min="0"
            max="22"
            step="0.1"
            defaultValue="11"
            onChange={(e) => {
              const zoom = parseFloat(e.target.value);
              map.current?.setZoom(zoom);
            }}
          />

          <label htmlFor="bearingSlider">
            Rotation (Bearing): <span id="bearingValue">0°</span>
          </label>
          <input
            type="range"
            id="bearingSlider"
            min="0"
            max="360"
            step="1"
            defaultValue="0"
            onChange={(e) => {
              const bearing = parseInt(e.target.value, 10);
              map.current?.setBearing(bearing);
            }}
          />

          <label htmlFor="pitchSlider">
            Tilt (Pitch): <span id="pitchValue">0°</span>
          </label>
          <input
            type="range"
            id="pitchSlider"
            min="0"
            max="60"
            step="1"
            defaultValue="0"
            onChange={(e) => {
              const pitch = parseInt(e.target.value, 10);
              map.current?.setPitch(pitch);
            }}
          />
        </div>

        <div className="export-controls">
          <label>
            Export Resolution:
            <select
              value={exportResolution}
              onChange={(e) => setExportResolution(Number(e.target.value))}
            >
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
            </select>
          </label>
          <button onClick={handleExport} className="export-button" disabled={isExporting}>
            {isExporting ? 'Exporting...' : 'Download Map as PNG'}
          </button>

          {isExporting && (
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasemapGIS;
