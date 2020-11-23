import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Components
import { covidContext } from '../../app'

// Style
import './Input.scss'

const updateData = async (url) => {
    const fetchData = await fetch(url);
    const res = fetchData.json();

    return res;
}

const Input = () => {    
    const { setCovidData } = useContext(covidContext);
    const [ orginalCountries, setOriginalCountries ] = useState([]);
    const [ allCountries, setAllCountries ] = useState([]);

    useEffect(() => {
        updateData(`https://api.covid19api.com/summary`).then(data => {
            setAllCountries(data.Countries)
            setOriginalCountries(data.Countries);
        }).catch(e => console.log(`Error: ${e}`));
    }, []);

    const countryArray = allCountries.map(e => {
        return e.Country;
    })

    const mappedArray = countryArray.map(e => {
        return <Link to={`/${e}`} key={e}><div className="input-element" onClick={() => SelectCountry(e)}><span>{e}</span></div></Link>
    });
    
    const getCountryData = async country => {
        const date = new Date;
        const fetchResponse = await fetch(`https://api.covid19api.com/country/${country}?from=${date.getFullYear()}-01-01T00:00:00Z&to=${date.getFullYear()}-${String(date.getMonth() + 1).length === 1 ? `0${date.getMonth()}` : date.getMonth() + 1}-${String(date.getDate() + 1).length === 1 ? `0${date.getDate()}` : date.getDate() + 1}T00:00:00Z`);
        const json = await fetchResponse.json();
        
        return json;
    }

    const SelectCountry = country => {
        document.querySelector("#country-input").value = "";
        getCountryData(country).then(res => {
            setCovidData(res);
        });
        setAllCountries(orginalCountries);
    }
    
    return (
        <div className="input-container">
            <input type="text" placeholder="Select Your Country..." id="country-input" autoComplete={"off"} onChange={e => {
                const inputValue = document.querySelector("#country-input").value;
                const value = new RegExp(inputValue, "i");
                let array = [];
                setAllCountries(null);
                for (const e of orginalCountries) {
                    const country = e.Country;
                    const index = country.search(value);
                    if (index != -1) {
                        array.push({
                            Country: country
                        })
                    }
                }
                setAllCountries(array);
            }}/>
            <div className="input-dropdown">
                <Link to={`/`}><div className="input-element" onClick={() => SelectCountry('/')}><span>Global</span></div></Link>
                {mappedArray}
            </div>
        </div>
    )
}  

export default Input;