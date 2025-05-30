import React, { useState } from 'react';
import axios from 'axios';

export default function CreateVenueWithOwner() {
  const [formData, setFormData] = useState({
    name: '',
    district_name: '',
    address: '',
    capacity: '',
    price_per_seat: '',
    phone_number: '',
    description: '',
    owner_first_name: '',
    owner_last_name: '',
    owner_username: '',
    owner_password: '',
    owner_phone_number: '',
    images: []
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');  // Xatolikni tozalash inputga yozganda
    setSuccessMessage(''); // Oldingi muvaffaqiyatni tozalash
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      images: e.target.files
    });
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'images') {
        Array.from(formData[key]).forEach((file) => {
          data.append('images', file);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('http://localhost:5000/api/admin/venues-with-owner', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Venue and Owner created:', response.data);

      setSuccessMessage('To’yxona va egasi muvaffaqiyatli yaratildi!');
      setFormData({
        name: '',
        district_name: '',
        address: '',
        capacity: '',
        price_per_seat: '',
        phone_number: '',
        description: '',
        owner_first_name: '',
        owner_last_name: '',
        owner_username: '',
        owner_password: '',
        owner_phone_number: '',
        images: []
      });
      setError('');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else if (error.response && error.response.data) {
        // Ba'zida backend xatolikni "message" maydonida yuborishi mumkin
        setError(error.response.data.message || 'Server bilan bog‘lanishda xatolik yuz berdi');
      } else {
        setError('Server bilan bog‘lanishda xatolik yuz berdi');
      }
      setSuccessMessage('');
    }
  };

  return (
    <div className="create-venue-owner">
      <h2>To'yxona va To'yxona egasini qo'shish</h2>

      {/* Xatolik va muvaffaqiyat xabarlarini ko‘rsatish */}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <h3>To'yxona Ma'lumotlari</h3>
        <div className="input-row">
          <input
            type="text"
            name="name"
            placeholder="To'yxona Nomi"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="district_name"
            placeholder="Tuman Nomi"
            value={formData.district_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-row">
          <input
            type="text"
            name="address"
            placeholder="Manzil"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="capacity"
            placeholder="Joylar Soni"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-row">
          <input
            type="number"
            name="price_per_seat"
            placeholder="Bir O'rindiq Narxi"
            value={formData.price_per_seat}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="Telfon raqam"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="text"
          name="Ta'rif"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <input className='desc'
          type="file"
          name="images"
          accept="image/*"
          onChange={handleFileChange}
          multiple
        />

        <h3>To'yxona Egasi Haqida Ma'lumot</h3>

        <div className="input-row">
          <input
            type="text"
            name="owner_first_name"
            placeholder="Ism"
            value={formData.owner_first_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="owner_last_name"
            placeholder="Familiya"
            value={formData.owner_last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-row">
          <input
            type="text"
            name="owner_username"
            placeholder="Username"
            value={formData.owner_username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="owner_password"
            placeholder="Password"
            value={formData.owner_password}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="text"
          name="owner_phone_number"
          placeholder="Telfon Raqam"
          value={formData.owner_phone_number}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
