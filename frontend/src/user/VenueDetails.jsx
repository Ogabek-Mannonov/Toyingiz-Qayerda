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
        setError("Token topilmadi. Iltimos, qaytadan tizimga kiring.");
        return;
      }

      const res = await axios.get(`http://localhost:5000/api/user/venues/${hallId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setVenue(res.data.venue);
    } catch (err) {
      console.error(err);
      setError("To’yxona ma’lumotlarini olishda xatolik yuz berdi");
    }
  };

  const handleBook = () => {
    navigate(`/user/book/${hallId}`);
  };

  if (error) return <p className="error">{error}</p>;
  if (!venue) return <p className="loading">Yuklanmoqda...</p>;

  return (
    <div className="venue-details-card">
      <div className="venue-images">
        {venue.photos && venue.photos.length > 0 ? (
          venue.photos.map((photo, idx) => (
            <img
              key={idx}
              src={`http://localhost:5000${photo}`}
              alt={`venue-${idx}`}
              className="venue-image"
            />
          ))
        ) : (
          <p>Rasmlar mavjud emas</p>
        )}
      </div>

      <div className="venue-content">
        <h2 className="venue-title">{venue.name}</h2>

        <div className="venue-info">
          <p><strong>Sig'imi:</strong> {venue.capacity} kishi</p>
          <p><strong>Narxi:</strong> {venue.price_per_seat.toLocaleString()} so‘m / o‘rindiq</p>
          <p><strong>Telefon:</strong> {venue.phone_number}</p>
          <p><strong>Manzil:</strong> {venue.address}</p>
          <p><strong>Rayon:</strong> {venue.district_name}</p>
          <p><strong>Tavsif:</strong> {venue.description}</p>
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
          Bron qilish
        </button>
      </div>
    </div>
  );
}
