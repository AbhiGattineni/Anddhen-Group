import React from 'react';
import Slider from '../inc/Slider';
import Vmc from './inc/Vmc';
import Company from '../inc/Company';
import Services from '../inc/Services';
import Cards from '../inc/Cards';
import Mywork from '../inc/Mywork';


function Home() {
    return (
        <div>
            <Slider />
            {/* our company */}
            <Company />
            {/* Our Mission, Vision & Values */}
            <Vmc />
            {/* Services */}
            <Services />
            {/* Ourwork */}
            <Mywork />
            {/* Our employees */}
            <Cards />
        </div>
    );
}

export default Home;