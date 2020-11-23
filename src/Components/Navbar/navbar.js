import React from 'react'

// Components
import * as Images from '../../Images/images'

// Style
import './navbar.scss'

const Navbar = () => {
    return (
        <nav className="covid-navbar">
            <div className="covid-navbar-rectangle">
                <img src={Images.covidLogo} alt="Covid logo" />
                <p>COVID-19 Track</p>
            </div>
        </nav>
    )
}

export default Navbar;