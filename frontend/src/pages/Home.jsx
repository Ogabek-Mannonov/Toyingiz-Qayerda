import React from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../index.css'


export default function Home() {

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
      alt: "To'y zalining gozal korinishi",
      caption: "Eng unutilmas kuningiz uchun eng chiroyli toy zallari"
    },
    {
      url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2VkZGluZyUyMHZlbnVlfGVufDB8fDB8fHww",
      alt: "Dekoratsiya namunasi",
      caption: "Nafis bezaklar bilan sizning toyingiz yanada gozal"
    },
    {
      url: "https://www.venuereport.com/media/cache/resolve/venue_gallery_big/uploads/2016%252F05%252Ffort-denison-5.jpg",
      alt: "Bayramning baxtiyor lahzalari",
      caption: "Baxtli onlarni biz bilan baham koring"
    },
  ];

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

      {/* BIZNING XIZMATLAR */}
      <section className="services-section">
        <h2>Bizning xizmatlarimiz</h2>
        <ul>
          <li>Toy zallari bron qilish</li>
          <li>Ovqatlanish va banqet xizmati</li>
          <li>Bezash va dekoratsiya</li>
          <li>Foto va video suratga olish</li>
        </ul>
      </section>

      {/* BIZ BILAN BOGLANING */}
      <section className="contact-section">
        <h2>Biz bilan boglaning</h2>
        <form className="contact-form">
          <input type="text" placeholder="Ismingiz" required />
          <input type="email" placeholder="Emailingiz" required />
          <textarea placeholder="Xabaringiz" rows="5" required></textarea>
          <button type="submit">Yuborish</button>
        </form>
      </section>
    </div>
  );
}
