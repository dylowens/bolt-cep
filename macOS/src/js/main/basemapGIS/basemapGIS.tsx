import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './basemapGIS.scss';

// You should replace this with your actual Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZHlsb3dlbnMiLCJhIjoiY2xoZWM3Y2EyMHVyNjNjczd3bHdxbDN1ZiJ9.mCmee7hWLyBUe4S-2XVG-A';

const basemapStyles = [
  { name: 'Dark', style: 'mapbox://styles/mapbox/dark-v10' },
  { name: 'Streets', style: 'mapbox://styles/mapbox/streets-v11' },
  { name: 'Outdoors', style: 'mapbox://styles/mapbox/outdoors-v11' },
  { name: 'Light', style: 'mapbox://styles/mapbox/light-v10' },
  { name: 'Satellite', style: 'mapbox://styles/mapbox/satellite-v9' },
];

const BasemapGIS: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeBasemap, setActiveBasemap] = useState(basemapStyles[0]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: activeBasemap.style,
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9
    });

    // Add this resize handler
    const resizeMap = () => {
      if (map.current && mapContainer.current) {
        const containerWidth = mapContainer.current.offsetWidth;
        mapContainer.current.style.height = `${containerWidth}px`;
        map.current.resize();
      }
    };

    // Call it once to set initial size
    resizeMap();

    // Add event listener for window resize
    window.addEventListener('resize', resizeMap);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', resizeMap);
    };
  }, []);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(activeBasemap.style);
    }
  }, [activeBasemap]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${mapboxgl.accessToken}`);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        map.current?.flyTo({ center: [lng, lat], zoom: 12 });
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error searching for location:', error);
      alert('Error searching for location');
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
      <div ref={mapContainer} className="map-container" />
      <div className="basemap-options">
        {basemapStyles.map((style) => (
          <button
            key={style.name}
            className={`basemap-option ${style.name === activeBasemap.name ? 'active' : ''}`}
            onClick={() => setActiveBasemap(style)}
          >
            {style.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BasemapGIS;
