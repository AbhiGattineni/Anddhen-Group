import React, { useState } from 'react';
import EnquiryForm from 'src/components/organisms/Forms/EnquiryForm';
import { Carousel } from 'react-bootstrap';

export const Ati = () => {
  const [setShowToast] = useState(false);
  const [setToastMsg] = useState('');
  return (
    <div className="">
      <div className="container mt-3">
        <h1 className="main-heading">Anddhen Trading & Investiment</h1>
      </div>
      <Carousel
        className="mt-4 mx-auto"
        style={{ maxWidth: '80%', maxHeight: '60%' }}
      >
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/assets/images/atiSlider1.jpg"
            alt="First slide"
            style={{ width: '600px', height: '300px' }}
          />
          <Carousel.Caption>
            <h4 className="text-dark">
              We pave your path to success, turning goals into achievements
            </h4>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/assets/images/atiSlider2.jpg"
            alt="Second slide"
            style={{ width: '600px', height: '300px' }}
          />
          <Carousel.Caption>
            <h4 className="text-black bg-white rounded-pill d-inline-block p-1">
              Earn more with our expertise, effortlessly and stress-free
            </h4>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="/assets/images/atiSlider3.jpg"
            alt="Third slide"
            style={{ width: '600px', height: '300px' }}
          />
          <Carousel.Caption>
            <h4>We flourish you in bullish & bearish</h4>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      <div className="container mt-3">
        <p>
          Unlock the true potential of your investments with our expert stock
          market management services. Specializing in short-term gains, we
          manage diverse portfolios across the Indian and U.S. stock markets,
          focusing on equities, ETFs, and other high-potential assets. Our team
          uses advanced market analysis, trend predictions, and proven
          strategies to maximize profits quickly while minimizing risk. Whether
          you're an experienced investor or just starting, we tailor our
          approach to your financial goals and risk tolerance. With us, you get
          personalized insights and cutting-edge strategies designed to
          capitalize on short-term opportunities for rapid growth.
        </p>
      </div>
      <EnquiryForm
        title="ATI : Andheen Trading and Investment Services"
        setShowToast={setShowToast}
        setToastMsg={setToastMsg}
      />
    </div>
  );
};
