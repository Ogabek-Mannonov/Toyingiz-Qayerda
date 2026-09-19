import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../index.css";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  const sliderImages = [
    {
      url: "https://images.squarespace-cdn.com/content/v1/52cd6c35e4b00bc0dba09595/1579010513202-K7Z8U0ND58F1E7DXE1V2/west-mill-exclusive-use-wedding-venue-52.JPG",
      alt: "Beautiful view of the wedding hall",
      caption: "The most beautiful wedding halls for your unforgettable day",
    },
    {
      url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2VkZGluZyUyMHZlbnVlfGVufDB8fDB8fHww",
      alt: "Decoration sample",
      caption: "Your wedding is even more beautiful with elegant decorations",
    },
    {
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=3000&auto=format&fit=crop",
      alt: "Happy moments of the celebration",
      caption: "Share your happy moments with us",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/send-to-telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
        });
      } else {
        setStatus("An error occurred.");
      }
    } catch (err) {
      console.error("Xatolik:", err);
      setStatus("An error occurred.");
    }
  };

  return (
    <div className="home-container">
      {/* SLIDER */}
      <div className="slider-wrapper">
        <Slider {...sliderSettings}>
          {sliderImages.map((slide, index) => (
            <div key={index} className="slide">
              <img src={slide.url} alt={slide.alt} />
              <div className="caption">{slide.caption}</div>
            </div>
          ))}
        </Slider>
      </div>

      {/* XIZMATLAR */}
      <section className="services-section">
        <h2>Our Services</h2>
        <ul>
          <li>Wedding Hall Booking</li>
          <li>Catering and Banquet Service</li>
          <li>Decoration</li>
          <li>Photography and Videography</li>
        </ul>
      </section>

      {/* CONTACT FORM */}
      <section className="contact-section">
        <h2>Contact Us</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="First Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Submit</button>
        </form>
        {status && <p className="status-message">{status}</p>}
      </section>
    </div>
  );
}
