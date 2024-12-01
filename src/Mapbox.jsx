import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; 
import './CSS/mapbox.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoicm9kcmlnb2FjYyIsImEiOiJjbTNxMGZ0dHIwa2U4MmtuMHBzc3Y3dGR0In0.t_iOtgYfgRFytWu5ZCk9pg'; // Reemplaza con tu Access Token

const Mapbox = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  // Lista de nuevas ubicaciones
  const locations = [
    { 
      name: 'Local  N°1', 
      coords: [-72.57184517449679, -38.729070461760294], 
      address: 'Avenida Principal 123',
      details: 'Esta sede ofrece atención al cliente de lunes a viernes de 9:00 a 18:00 horas. Teléfono: +56 9 1234 5678.'
    },
    { 
      name: 'Local N°2', 
      coords: [-72.649305863841, -38.75669508910295], 
      address: 'Calle Secundaria 456',
      details: 'En esta sede se realizan entregas y devoluciones. Horario: lunes a sábado de 10:00 a 20:00 horas. Teléfono: +56 9 8765 4321.'
    },
  ];

  const [selectedLocation, setSelectedLocation] = useState(null); // Estado para la ubicación seleccionada

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: locations[0].coords, // Coordenadas iniciales: la primera sede
      zoom: 12,
    });

    mapInstance.on('load', () => {
      setMap(mapInstance);

      // Agregar marcadores dinámicamente para cada ubicación
      locations.forEach(location => {
        const marker = new mapboxgl.Marker({ color: 'blue' })
          .setLngLat(location.coords)
          .setPopup(
            new mapboxgl.Popup().setHTML(`
              <div class="popup-content">
                <h4>${location.name}</h4>
                <p>${location.address}</p>
              </div>
            `)
          )
          .addTo(mapInstance);
      });
    });

    return () => mapInstance.remove();
  }, []);

  // Función para centrar el mapa y mostrar la información de la ubicación
  const handleLocationClick = (location) => {
    if (map) {
      map.flyTo({
        center: location.coords,
        zoom: 18, // Zoom más cercano
        essential: true,
      });
    }
    setSelectedLocation(location); // Actualizar información seleccionada
  };

  return (
    <div className="map-container">
      <header>Mapa de sedes</header>
      <div className="map-wrapper">
        {/* Contenedor para los botones */}
        <div className="location-buttons">
          <h3>Direcciones</h3>
          {locations.map((location, index) => (
            <button
              key={index}
              onClick={() => handleLocationClick(location)}
              className="location-button"
            >
              {location.name}
            </button>
          ))}
        </div>

        {/* Contenedor del mapa */}
        <div
          ref={mapContainerRef}
          id="map"
        />
      </div>

      {/* Contenedor para mostrar la información de la ubicación seleccionada */}
      {selectedLocation && (
        <div className="location-info">
          <h3>Información de {selectedLocation.name}</h3>
          <p><strong>Dirección:</strong> {selectedLocation.address}</p>
          <p><strong>Detalles:</strong> {selectedLocation.details}</p>
        </div>
      )}
    </div>
  );
};

export default Mapbox;
