export interface City {
    name: string;
}

export interface District {
    name: string;
    cities: string[];
}

export interface State {
    name: string;
    districts: District[];
}

export interface Country {
    code: string;
    name: string;
    states: State[];
}

export const LOCATION_DATA: Country[] = [
    {
        code: 'IN',
        name: 'India',
        states: [
            {
                name: 'Tamil Nadu',
                districts: [
                    { name: 'Chennai', cities: ['Chennai City', 'Adyar', 'Anna Nagar', 'Velachery', 'T. Nagar', 'Mylapore', 'Guindy'] },
                    { name: 'Coimbatore', cities: ['Coimbatore City', 'Pollachi', 'Mettupalayam', 'Valparai', 'Udumalaipettai'] },
                    { name: 'Madurai', cities: ['Madurai City', 'Melur', 'Thirumangalam', 'Vadipatti', 'Usilampatti'] },
                    { name: 'Trichy', cities: ['Trichy City', 'Srirangam', 'Manapparai', 'Lalgudi', 'Thuvakudi'] },
                    { name: 'Salem', cities: ['Salem City', 'Mettur', 'Attur', 'Omalur', 'Sankari'] },
                    { name: 'Tirunelveli', cities: ['Tirunelveli City', 'Ambasamudram', 'Nanguneri', 'Radhapuram'] },
                    { name: 'Erode', cities: ['Erode City', 'Bhavani', 'Gobichettipalayam', 'Perundurai'] },
                    { name: 'Vellore', cities: ['Vellore City', 'Gudiyatham', 'Katpadi', 'Arcot'] },
                    { name: 'Thanjavur', cities: ['Thanjavur City', 'Kumbakonam', 'Pattukkottai', 'Papanasam'] },
                    { name: 'Tuticorin', cities: ['Tuticorin City', 'Kovilpatti', 'Tiruchendur', 'Ettayapuram'] }
                ]
            },
            {
                name: 'Maharashtra',
                districts: [
                    { name: 'Mumbai City', cities: ['Colaba', 'Fort', 'Marine Drive', 'Byculla', 'Dadar'] },
                    { name: 'Mumbai Suburban', cities: ['Andheri', 'Bandra', 'Borivali', 'Juhu', 'Powai', 'Malad', 'Goregaon'] },
                    { name: 'Pune', cities: ['Pune City', 'Hinjewadi', 'Magarpatta', 'Viman Nagar', 'Hadapsar', 'Baner'] },
                    { name: 'Nagpur', cities: ['Nagpur City', 'Kamptee', 'Hingna', 'Katol'] },
                    { name: 'Thane', cities: ['Thane City', 'Kalyan', 'Dombivli', 'Ulhasnagar', 'Mira-Bhayandar'] },
                    { name: 'Nashik', cities: ['Nashik City', 'Deolali', 'Igatpuri', 'Sinnar'] },
                    { name: 'Aurangabad', cities: ['Aurangabad City', 'Paithan', 'Sillod'] }
                ]
            },
            {
                name: 'Karnataka',
                districts: [
                    { name: 'Bangalore Urban', cities: ['Bangalore City', 'Electronic City', 'Whitefield', 'Koramangala', 'Indiranagar', 'HSR Layout'] },
                    { name: 'Bangalore Rural', cities: ['Devanahalli', 'Doddaballapura', 'Hosakote', 'Nelamangala'] },
                    { name: 'Mysore', cities: ['Mysore City', 'Nanjangud', 'Hunsur', 'T. Narasipura'] },
                    { name: 'Mangalore', cities: ['Mangalore City', 'Ullal', 'Surathkal', 'Bantwal'] },
                    { name: 'Hubli-Dharwad', cities: ['Hubli City', 'Dharwad City', 'Navalgund'] },
                    { name: 'Belgaum', cities: ['Belgaum City', 'Gokak', 'Athani'] }
                ]
            },
            {
                name: 'Kerala',
                districts: [
                    { name: 'Trivandrum', cities: ['Trivandrum City', 'Neyyattinkara', 'Attingal', 'Varkala'] },
                    { name: 'Ernakulam', cities: ['Kochi', 'Aluva', 'Muvattupuzha', 'Kothamangalam', 'Perumbavoor'] },
                    { name: 'Kozhikode', cities: ['Kozhikode City', 'Vatkara', 'Quilandy'] },
                    { name: 'Thrissur', cities: ['Thrissur City', 'Chalakudy', 'Guruvayur', 'Kunnamkulam'] },
                    { name: 'Palakkad', cities: ['Palakkad City', 'Ottapalam', 'Shoranur', 'Chittur'] }
                ]
            },
            {
                name: 'Andhra Pradesh',
                districts: [
                    { name: 'Visakhapatnam', cities: ['Vizag City', 'Gajuwaka', 'Anakapalle', 'Bheemunipatnam'] },
                    { name: 'Vijayawada', cities: ['Vijayawada City', 'Gudivada', 'Jaggayyapeta'] },
                    { name: 'Guntur', cities: ['Guntur City', 'Tenali', 'Narasaraopet', 'Bapatla'] },
                    { name: 'Nellore', cities: ['Nellore City', 'Kavali', 'Gudur'] },
                    { name: 'Kurnool', cities: ['Kurnool City', 'Adoni', 'Nandyal'] }
                ]
            },
            {
                name: 'Telangana',
                districts: [
                    { name: 'Hyderabad', cities: ['Hyderabad City', 'Secunderabad', 'Gachibowli', 'Madhapur', 'Banjara Hills', 'Jubilee Hills'] },
                    { name: 'Rangareddy', cities: ['Cyberabad', 'Manikonda', 'Rajendranagar', 'L.B. Nagar'] },
                    { name: 'Warangal', cities: ['Warangal City', 'Hanamkonda', 'Kazipet'] },
                    { name: 'Nizamabad', cities: ['Nizamabad City', 'Bodhan', 'Armoor'] }
                ]
            },
            {
                name: 'Gujarat',
                districts: [
                    { name: 'Ahmedabad', cities: ['Ahmedabad City', 'Maninagar', 'Satellite', 'Vastrapur', 'Bapu Nagar'] },
                    { name: 'Surat', cities: ['Surat City', 'Adajan', 'Varachha', 'Katargam'] },
                    { name: 'Vadodara', cities: ['Vadodara City', 'Sayajigunj', 'Alkapuri'] },
                    { name: 'Rajkot', cities: ['Rajkot City', 'Morbi', 'Gondal'] }
                ]
            },
            {
                name: 'Delhi',
                districts: [
                    { name: 'North Delhi', cities: ['Model Town', 'Narela', 'Saraswati Vihar'] },
                    { name: 'South Delhi', cities: ['Saket', 'Hauz Khas', 'Mehrauli', 'Greater Kailash', 'RK Puram'] },
                    { name: 'East Delhi', cities: ['Preet Vihar', 'Vivek Vihar', 'Mayur Vihar', 'Shahdara'] },
                    { name: 'West Delhi', cities: ['Punjabi Bagh', 'Rajouri Garden', 'Janakpuri', 'Dwarka'] },
                    { name: 'New Delhi', cities: ['Connaught Place', 'Chanakyapuri', 'Lodhi Road'] }
                ]
            },
            {
                name: 'West Bengal',
                districts: [
                    { name: 'Kolkata', cities: ['Kolkata City', 'Salt Lake', 'New Town', 'Ballygunge', 'Tollygunge', 'Behala'] },
                    { name: 'North 24 Parganas', cities: ['Bidhannagar', 'Barasat', 'Barrackpore', 'Dum Dum'] },
                    { name: 'South 24 Parganas', cities: ['Alipore', 'Baruipur', 'Sonarpur'] },
                    { name: 'Howrah', cities: ['Howrah City', 'Bally', 'Shalimar'] }
                ]
            },
            {
                name: 'Uttar Pradesh',
                districts: [
                    { name: 'Lucknow', cities: ['Lucknow City', 'Gomti Nagar', 'Aliganj', 'Hazratganj'] },
                    { name: 'Gautam Buddh Nagar', cities: ['Noida', 'Greater Noida', 'Dadri'] },
                    { name: 'Ghaziabad', cities: ['Ghaziabad City', 'Indirapuram', 'Vaishali'] },
                    { name: 'Agra', cities: ['Agra City', 'Fatehabad', 'Etmadpur'] },
                    { name: 'Kanpur', cities: ['Kanpur City', 'Jajmau', 'Kalyanpur'] }
                ]
            }
        ]
    },
    {
        code: 'US',
        name: 'United States',
        states: [
            {
                name: 'California',
                districts: [
                    { name: 'Los Angeles County', cities: ['Los Angeles', 'Santa Monica', 'Long Beach', 'Pasadena'] },
                    { name: 'San Francisco County', cities: ['San Francisco'] },
                    { name: 'San Diego County', cities: ['San Diego', 'Chula Vista', 'Oceanside'] },
                    { name: 'Santa Clara County', cities: ['San Jose', 'Palo Alto', 'Mountain View', 'Sunnyvale', 'Cupertino'] }
                ]
            },
            {
                name: 'New York',
                districts: [
                    { name: 'New York City', cities: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'] },
                    { name: 'Erie County', cities: ['Buffalo', 'Amherst'] },
                    { name: 'Monroe County', cities: ['Rochester'] }
                ]
            },
            {
                name: 'Texas',
                districts: [
                    { name: 'Harris County', cities: ['Houston'] },
                    { name: 'Dallas County', cities: ['Dallas', 'Irving', 'Garland'] },
                    { name: 'Travis County', cities: ['Austin'] }
                ]
            }
        ]
    },
    {
        code: 'GB',
        name: 'United Kingdom',
        states: [
            {
                name: 'England',
                districts: [
                    { name: 'Greater London', cities: ['London City', 'Westminster', 'Camden', 'Greenwich', 'Hackney'] },
                    { name: 'West Midlands', cities: ['Birmingham', 'Coventry', 'Wolverhampton'] },
                    { name: 'Greater Manchester', cities: ['Manchester City', 'Salford', 'Bolton'] }
                ]
            },
            {
                name: 'Scotland',
                districts: [
                    { name: 'Glasgow City', cities: ['Glasgow'] },
                    { name: 'Edinburgh City', cities: ['Edinburgh'] },
                    { name: 'Aberdeen City', cities: ['Aberdeen'] }
                ]
            }
        ]
    },
    {
        code: 'AE',
        name: 'United Arab Emirates',
        states: [
            {
                name: 'Dubai',
                districts: [
                    { name: 'Dubai', cities: ['Deira', 'Bur Dubai', 'Jumeirah', 'Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Business Bay', 'Al Barsha'] }
                ]
            },
            {
                name: 'Abu Dhabi',
                districts: [
                    { name: 'Abu Dhabi City', cities: ['Abu Dhabi', 'Yas Island', 'Saadiyat Island', 'Reem Island'] },
                    { name: 'Al Ain', cities: ['Al Ain City', 'Zakher'] },
                    { name: 'Al Dhafra', cities: ['Madinat Zayed'] }
                ]
            },
            {
                name: 'Sharjah',
                districts: [
                    { name: 'Sharjah City', cities: ['Sharjah City', 'Al Nahda', 'Al Khan'] }
                ]
            }
        ]
    }
];

export const getCountries = () => LOCATION_DATA.map(c => ({ code: c.code, name: c.name }));

export const getStatesForCountry = (countryCode: string) => {
    const country = LOCATION_DATA.find(c => c.code === countryCode);
    return country ? country.states.map(s => s.name) : [];
};

export const getDistrictsForState = (countryCode: string, stateName: string) => {
    const country = LOCATION_DATA.find(c => c.code === countryCode);
    const state = country?.states.find(s => s.name === stateName);
    return state ? state.districts.map(d => d.name) : [];
};

export const getCitiesForDistrict = (countryCode: string, stateName: string, districtName: string) => {
    const country = LOCATION_DATA.find(c => c.code === countryCode);
    const state = country?.states.find(s => s.name === stateName);
    const district = state?.districts.find(d => d.name === districtName);
    return district ? district.cities : [];
};
