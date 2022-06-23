import React from 'react';
import { Link } from 'react-router-dom';
import Slider from '../inc/Slider';
import Vmc from './inc/Vmc';
import Company from '../inc/Company';
import Services from '../inc/Services';
import Cards from '../inc/Cards';


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
            {/* Our employees */}
            <Cards />
        </div>
    );
}

export default Home;