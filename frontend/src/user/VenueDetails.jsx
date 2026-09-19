import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import './venue-details.css';

export default function VenueDetails() {
  const { hallId } = useParams();
  const [venue, setVenue] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVenueDetails();
  }, []);

  const fetchVenueDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Token not found. Please log in again.");
        return;
      }

      const res = await axios.get(`/api/user/venues/${hallId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setVenue(res.data.venue);
    } catch (err) {
      console.error(err);
      setError("Failed to load venue details");
    }
  };

  const handleBook = () => {
    navigate(`/user/book/${hallId}`);
  };

  if (error) return <p className="error">{error}</p>;
  if (!venue) return <p className="loading">Loading...</p>;

  return (
    <div className="venue-details-card">
      <div className="venue-images">
        {venue.photos && venue.photos.length > 0 ? (
          venue.photos.map((photo, idx) => (
            <img
              key={idx}
              src={`${photo}`}
              alt={`venue-${idx}`}
              className="venue-image"
            />
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>

      <div className="venue-content">
        <h2 className="venue-title">{venue.name}</h2>

        <div className="venue-info">
          <p><strong>Capacity:</strong> {venue.capacity} people</p>
          <p><strong>Price:</strong> ${venue.price_per_seat.toLocaleString()} / seat</p>
          <p><strong>Phone:</strong> {venue.phone_number}</p>
          <p><strong>Address:</strong> {venue.address}</p>
          <p><strong>District:</strong> {venue.district_name}</p>
          <p><strong>Description:</strong> {venue.description}</p>
        </div>

        {/* MAP qismi */}
        {venue.latitude && venue.longitude && (
          <div className="venue-map">
            <MapContainer
              center={[venue.latitude, venue.longitude]}
              zoom={15}
              style={{ height: "400px", width: "100%", borderRadius: "10px", marginTop: "15px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[venue.latitude, venue.longitude]}>
                <Popup>{venue.name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        <button onClick={handleBook} className="book-button">
          Book Now
        </button>
      </div>
    </div>
  );
}
