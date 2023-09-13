import Subsidiary1 from './components/images/marketing.jpg';
import Subsidiary2 from './components/images/consulting2.jpg';
import Subsidiary3 from './components/images/service6.jpg';
import Subsidiary4 from './components/images/philanthropy1.jpg';
import Subsidiary5 from './components/images/trade3.jpg';

export const priceData = [
    {
        id: 1,
        priceName: "Hobby",
        price: 79,
        features: ["unlimited build.", "lorem duplicate data.", "5TB Lorem, ipsum dolor."]
    },
    {
        id: 2,
        priceName: "Growth",
        price: 149,
        features: ["unlimited build.", "lorem duplicate data.", "5TB Lorem, ipsum dolor.", "5TB Lorem, ipsum dolor.", "5TB Lorem, ipsum dolor."],
        popularity: true
    },
    {
        id: 3,
        priceName: "Scale",
        price: 349,
        features: ["unlimited build.", "lorem duplicate data.", "5TB Lorem, ipsum dolor."]
    },
]

export const subsidiaries = [
    {
        Name: "Anddhen Marketing Services",
        Photo: Subsidiary1,
        Description: "Description for Subsidiary 1",
        link: "/ams"
    },
    {
        Name: "Anddhen Consulting Services",
        Photo: Subsidiary2,
        Description: "Description for Subsidiary 2",
        link: "/acs"
    },
    {
        Name: "Anddhen Software Services",
        Photo: Subsidiary3,
        Description: "Description for Subsidiary 3",
        link: "/ass"
    },
    {
        Name: "Anddhen Philanthropy Services",
        Photo: Subsidiary4,
        Description: "Description for Subsidiary 4",
        link: "/aps"
    },
    {
        Name: "Anddhen Trading & Investiment",
        Photo: Subsidiary5,
        Description: "Description for Subsidiary 5",
        link: "/ati"
    }
];