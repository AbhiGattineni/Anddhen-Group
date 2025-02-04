import React, { useState } from 'react';
import EnquiryForm from 'src/components/organisms/Forms/EnquiryForm';
import { Carousel, Container } from 'react-bootstrap';

export const Ati = () => {
  const [setShowToast] = useState(false);
  const [setToastMsg] = useState('');
  return (
    <div className="section border-top">
      <h1 className="text-center">Anddhen Trading and Investment </h1>
      <div className="underline mx-auto"></div>
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
            <h4 className="text-dark">Trade with us, grow with us</h4>
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
            <h4>Invest smart, grow from the start</h4>
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

      <div className="mt-5 p-3 rounded bg-light">
        <Container>
          <p className="p-2" style={{ textAlign: 'justify' }}>
            Unlock the true potential of your investments with our expert stock
            market management services. Specializing in short-term gains, we
            manage diverse portfolios across the Indian and U.S. stock markets,
            focusing on equities, ETFs, and other high-potential assets. Our
            team uses advanced market analysis, trend predictions, and proven
            strategies to maximize profits quickly while minimizing risk.
            Whether you're an experienced investor or just starting, we tailor
            our approach to your financial goals and risk tolerance. With us,
            you get personalized insights and cutting-edge strategies designed
            to capitalize on short-term opportunities for rapid growth.
          </p>
        </Container>
      </div>
      <EnquiryForm
        title="ATI : Andheen Trading and Investment Services"
        setShowToast={setShowToast}
        setToastMsg={setToastMsg}
      />
    </div>
  );
};
