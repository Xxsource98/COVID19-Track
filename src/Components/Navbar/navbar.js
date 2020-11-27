import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

// Components
import * as Images from '../../Images/images'
import { covidContext } from '../../App'

// Style
import './navbar.scss'

const Navbar = () => {
    const { setCurrentCountry } = useContext(covidContext);

    return (
        <nav className="covid-navbar">
            <div className="covid-navbar-rectangle">
                <img src={Images.covidLogo} alt="Covid logo" />
                <Link to="/" onClick={() => setCurrentCountry("Global")}><p>COVID-19 Track</p></Link>
            </div>
        </nav>
    )
}

export default Navbar;