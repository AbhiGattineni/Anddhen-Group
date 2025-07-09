import React, { useState } from 'react';
import Slider from 'react-slick';
import { Card, Button } from 'react-bootstrap';
import investmentData from 'src/data/investmentsData';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const countries = Object.keys(investmentData);

const InvestmentCarousel = () => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [flippedIndex, setFlippedIndex] = useState(null);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
    arrows: true,
  };

  const handleCardClick = (idx) => {
    setFlippedIndex(flippedIndex === idx ? null : idx);
  };

  // Font size and color for card content (match paragraph below)
  const cardFontSize = 14;
  const cardFontColor = '#262626';

  return (
    <div className="container" style={{ maxWidth: 1500, margin: '0 auto', padding: 0 }}>
      {/* Country Selector Bar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, gap: 16 }}>
        {countries.map((country) => (
          <Button
            key={country}
            variant="link"
            style={{
              color: selectedCountry === country ? '#007bff' : '#6c757d',
              fontWeight: selectedCountry === country ? 700 : 400,
              borderBottom: selectedCountry === country ? '2px solid #007bff' : 'none',
              borderRadius: 0,
              textDecoration: 'none',
              fontSize: 18,
              padding: '0 12px',
              transition: 'color 0.2s',
            }}
            onClick={() => { setSelectedCountry(country); setFlippedIndex(null); }}
            onMouseOver={e => { if (selectedCountry !== country) e.target.style.color = '#0056b3'; }}
            onMouseOut={e => { if (selectedCountry !== country) e.target.style.color = '#6c757d'; }}
          >
            {country}
          </Button>
        ))}
      </div>
      {/* Investment Cards Carousel - Centered */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '0 auto' }}>
        <style>{`
          .slick-slide { padding: 3px; }
        `}</style>
        <div style={{ width: '100%', maxWidth: 1300, margin: '0 auto' }}>
          <Slider {...settings}>
            {investmentData[selectedCountry].map((item, idx) => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  className={`investment-card-flip${flippedIndex === idx ? ' flipped' : ''}`}
                  onClick={() => handleCardClick(idx)}
                  style={{ cursor: 'pointer', perspective: 1000, width: 240, height: 290, margin: 0 }}
                >
                  <div className="investment-card-inner" style={{ position: 'relative', width: 240, height: 290, transition: 'transform 0.6s', transformStyle: 'preserve-3d', transform: flippedIndex === idx ? 'rotateY(180deg)' : 'none', margin: 0 }}>
                    {/* Front Side */}
                    <Card className="investment-card-front" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', zIndex: 2, padding: '0.75rem', fontSize: cardFontSize, color: cardFontColor, margin: 0, overflow: 'visible', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <Card.Body className="text-center p-2 d-flex flex-column justify-content-center align-items-center" style={{ width: '100%', height: '100%', padding: '0.75rem' }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
                        <Card.Title style={{ fontSize: 16, marginBottom: 4, color: cardFontColor }}>{item.name}</Card.Title>
                        <Card.Text style={{ fontSize: cardFontSize, color: cardFontColor, marginBottom: 0 }}>{item.description}</Card.Text>
                        <div style={{ fontSize: 10, color: '#888', marginTop: 6 }}>(Click to flip)</div>
                      </Card.Body>
                    </Card>
                    {/* Back Side */}
                    <Card className="investment-card-back" style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', zIndex: 1, padding: '0.75rem', fontSize: cardFontSize, color: cardFontColor, margin: 0, overflow: 'visible', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                      <Card.Body className="p-2" style={{ width: '100%', height: '100%', padding: '0.75rem', overflow: 'visible', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Card.Title style={{ fontSize: 14, marginBottom: 2, color: cardFontColor }}>Advantages</Card.Title>
                        <ul style={{ paddingLeft: 16, marginBottom: 6, fontSize: cardFontSize, color: cardFontColor }}>
                          {item.advantages.map((adv, i) => <li key={i}>{adv}</li>)}
                        </ul>
                        <Card.Title style={{ fontSize: 14, marginBottom: 2, color: cardFontColor }}>Disadvantages</Card.Title>
                        <ul style={{ paddingLeft: 16, marginBottom: 0, fontSize: cardFontSize, color: cardFontColor }}>
                          {item.disadvantages.map((dis, i) => <li key={i}>{dis}</li>)}
                        </ul>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCarousel; 