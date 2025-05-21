import React, { useState, useEffect } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import EnquiryForm from 'src/components/organisms/Forms/EnquiryForm';
import CustomToast from 'src/components/atoms/Toast/CustomToast';
import TransactionTable from 'src/components/generalComponents/TransactionTable';

export const Aps = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const logo = isMobile ? '/assets/images/apsmobile.JPG' : '/assets/images/apsdesktop.JPG';

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <h5 className="py-3 text-center" style={{ fontWeight: 'bold' }}>
        ANDDHEN - JAYA LAKSHMI FOUNDATION
      </h5>
      <div className="pb-3 text-center" style={{ width: '100%' }}>
        <LazyLoadImage
          effect="blur"
          className="rounded"
          src={logo}
          alt="Card image cap"
          style={{
            height: isMobile ? '40vh' : '60vh',
            width: isMobile ? '80vw' : '60vw',
            objectFit: isMobile ? 'cover' : 'contain', // Show full image on desktop
          }}
        />
      </div>

      <section className="p-2 bg-c-light border-top">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-9">
              <h5 className="pt-5 main-heading text-center">Education</h5>
              <div className="underline mx-auto"></div>
              <p className="p-2" style={{ textAlign: 'justify' }}>
                <strong>Dear Friends,</strong>
              </p>
              <p className="p-2" style={{ textAlign: 'justify' }}>
                The <strong>ANDDHEN - JAYA LAKSHMI FOUNDATION</strong> is a labor of love, a
                profound homage to my cherished grandmother, <strong>Jaya Lakshmi</strong>, who is
                alive and continues to inspire us. As a devoted government school headmistress, she
                dedicated her life to nurturing and educating countless children, instilling in them
                the values of knowledge, integrity, and compassion. Her relentless commitment to
                education and her selfless care for others have profoundly influenced my life,
                guiding me with her wisdom and unwavering support.
              </p>
              <p className="p-2" style={{ textAlign: 'justify' }}>
                Now, in her honor, we have established this foundation to continue her life&rsquo;s
                work, to reach out to those children dreams are hindered by financial constraints,
                and to light the path to a brighter future through education. Education is the most
                powerful tool we can offer to uplift lives and break the cycle of poverty. The{' '}
                <strong>ANDDHEN - JAYA LAKSHMI FOUNDATION</strong> is dedicated to this noble cause,
                striving to ensure that no child is deprived of the opportunity to learn and grow
                due to financial hardship.
              </p>
              <p className="p-2" style={{ textAlign: 'justify' }}>
                By providing scholarships, resources, and support, we aim to transform the lives of
                these young learners, giving them the chance to achieve their fullest potential and
                contribute positively to society. We are not just funding education; we are
                nurturing dreams, fostering hope, and building a foundation for a brighter tomorrow.
              </p>
              <p className="p-2" style={{ textAlign: 'justify' }}>
                The impact of <strong>Jaya Lakshmi</strong>&rsquo;s teachings beyond the classroom.
                Her lessons of kindness, resilience, and dedication resonate deeply within me and
                countless others who had the privilege of knowing her. Through the{' '}
                <strong>ANDDHEN - JAYA LAKSHMI FOUNDATION</strong>, we aspire to extend her legacy
                of compassion and generosity to children who need it the most.
              </p>
              <p className="p-2" style={{ textAlign: 'justify' }}>
                Each contribution to this foundation is a step toward creating a world where every
                child has access to the education they deserve, enabling them to rise above their
                circumstances and thrive. We invite you to join us on this heartfelt journey. Your
                generosity can change the course of a child&rsquo;s life, giving them hope,
                possibilities, and a future filled with promise.
              </p>
              <p className="p-2" style={{ textAlign: 'justify' }}>
                If you feel moved to support our mission or wish to learn more about how you can
                make a difference, please contact us. Together.
              </p>
              <p className="px-2" style={{ textAlign: 'justify' }}>
                With heartfelt gratitude,
              </p>
              <p className="px-2" style={{ textAlign: 'justify' }}>
                <strong>Founder,</strong>
                <br />
                <strong>ANDDHEN - JAYA LAKSHMI FOUNDATION</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
      <TransactionTable />

      {/* Contact Form */}
      <section className="py-4 border-top">
        <div className="text-center">
          <p className="row justify-content-center">
            <dt className="justify-content-center">
              If you want to support us, please submit your enquiries here.
            </dt>
          </p>
        </div>
        <EnquiryForm
          title="APS: Anddhen Philanthropy Services"
          setShowToast={setShowToast}
          setToastMsg={setToastMsg}
        />
        <CustomToast showToast={showToast} setShowToast={setShowToast} toastMsg={toastMsg} />
      </section>
    </div>
  );
};
