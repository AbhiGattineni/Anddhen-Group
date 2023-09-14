import React from 'react';
import Slider from '../inc/Slider';
import Vmc from './inc/Vmc';
import Company from '../inc/Company';
import Cards from '../inc/Cards';
import Subsidiaries from '../inc/Subsidiaries';


function Home() {
    return (
        <div>
            <Slider />
            {/* our company */}
            <Company />
            {/* Our Mission, Vision & Values */}
            <Vmc />
            {/* Subsidiaries */}
            <Subsidiaries />
        </div>
    );
}

export default Home;