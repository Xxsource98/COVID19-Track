import React from 'react'
import { useParams } from 'react-router-dom'

// Components
import * as Images from '../../Images/images'
import Chart from './Chart'

// Style
import './ChartInfoContent.scss'

const ChartInfoContent = () => {
    const { country } = useParams();
    const isEmpty = country === "" || country === undefined;

    return (
        <div className={`chart-info-content ${isEmpty ? "global" : ""}`}>
            <div className="site-left-side-header">
                <img src={Images.chartLogo} alt="Chart Logo" />
                <p>Chart - {isEmpty ? "Total Values" : "Monthly Increase"}</p>
            </div>
            <Chart isCountryEmpty={isEmpty}/>
            <div className="bottom-api-text">This site is using <a href="https://covid19api.com" target="_blank">api.covid19api.com</a> for get coronavirus data.</div>
        </div>
    )
}

export default ChartInfoContent;