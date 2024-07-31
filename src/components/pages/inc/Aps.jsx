import React,{useState} from 'react';
import { LazyLoadImage } from "react-lazy-load-image-component";
import logo from './../../images/photo-1594708767771-a7502209ff51.avif';
import EnquiryForm from 'src/components/organisms/Forms/EnquiryForm';
import CustomToast from 'src/components/atoms/Toast/CustomToast';

export const Aps = () => {
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    return (
        <div className="" style={{height:"100%",width:"100%"}}>
            <h5 className='py-3 text-center' style={{ fontWeight: 'bold' }}>ANDDHEN - JAYA LAKSHMI FOUNDATION</h5>
            <div className='pb-3 text-center' style={{width:"100%"}}>
            <LazyLoadImage
            effect="blur"
            className="rounded"
            src={logo}
            alt="Card image cap"
            style={{ height: '50vh', width: '60vw', objectFit: 'cover' }} //change this for image height and width
        />
            </div>
            
            <section className='p-2 bg-c-light border-top'>
                <div className='container'>
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-10 col-lg-9">
                            <h5 className='pt-5 main-heading text-center'>Education</h5>
                            <div className='underline mx-auto'></div>
                            <p className='p-2' style={{ textAlign: 'justify' }}>
                                <strong>Dear Friends,</strong>
                            </p>
                            <p className='p-2' style={{ textAlign: 'justify' }}>
                                The <strong>ANDDHEN - JAYA LAKSHMI FOUNDATION</strong> is a labor of love, a profound homage to my cherished grandmother, <strong>Jaya Lakshmi</strong>, who is alive and continues to inspire us. As a devoted government school headmistress, she dedicated her life to nurturing and educating countless children, instilling in them the values of knowledge, integrity, and compassion. Her relentless commitment to education and her selfless care for others have profoundly influenced my life, guiding me with her wisdom and unwavering support.
                            </p>
                            <p className='p-2' style={{ textAlign: 'justify' }}>
                                Now, in her honor, we have established this foundation to continue her life's work, to reach out to those children whose dreams are hindered by financial constraints, and to light the path to a brighter future through education. Education is the most powerful tool we can offer to uplift lives and break the cycle of poverty. The <strong>ANDDHEN - JAYA LAKSHMI FOUNDATION</strong> is dedicated to this noble cause, striving to ensure that no child is deprived of the opportunity to learn and grow due to financial hardship.
                            </p>
                            <p className='p-2' style={{ textAlign: 'justify' }}>
                                By providing scholarships, resources, and support, we aim to transform the lives of these young learners, giving them the chance to achieve their fullest potential and contribute positively to society. We are not just funding education; we are nurturing dreams, fostering hope, and building a foundation for a brighter tomorrow.
                            </p>
                            <p className='p-2' style={{ textAlign: 'justify' }}>
                                The impact of <strong>Jaya Lakshmi</strong>'s teachings goes beyond the classroom. Her lessons of kindness, resilience, and dedication resonate deeply within me and countless others who had the privilege of knowing her. Through the <strong>ANDDHEN - JAYA LAKSHMI FOUNDATION</strong>, we aspire to extend her legacy of compassion and generosity to children who need it the most.
                            </p>
                            <p className='p-2' style={{ textAlign: 'justify' }}>
                                Each contribution to this foundation is a step toward creating a world where every child has access to the education they deserve, enabling them to rise above their circumstances and thrive. We invite you to join us on this heartfelt journey. Your generosity can change the course of a child's life, offering them hope, possibilities, and a future filled with promise.
                            </p>
                            <p className='p-2' style={{ textAlign: 'justify' }}>
                                If you feel moved to support our mission or wish to learn more about how you can make a difference, please contact us. Together, we can keep <strong>Jaya Lakshmi</strong>'s legacy alive and create a world where every child's educational aspirations are within reach.
                            </p>
                            <p className='px-2' style={{ textAlign: 'justify' }}>
                                With heartfelt gratitude,
                            </p>
                            <p className='px-2' style={{ textAlign: 'justify' }}>
                                <strong>Founder,</strong><br />
                                <strong>ANDDHEN - JAYA LAKSHMI FOUNDATION</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
<section className='py-4 border-top'>
    <div className='text-center'>
        <p className='row justify-content-center'>
            <dt className='justify-content-center'>If you want to support us, please submit your enquiries here.</dt>
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
    )
}
