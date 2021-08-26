import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

// Components
import * as Images from '../../Images/images'
import Chart from './Chart'

// Style
import './ChartInfoContent.scss'

const ChartInfoContent = () => {
    const { country } = useParams();
    const isEmpty = country === "" || country === undefined;
    const [chartType, setChartType] = useState("monthly");

    const switchChartType = () => {
        chartType === "monthly" ? setChartType("daily") : setChartType("monthly");
    }

    return (
        <div className={`chart-info-content ${isEmpty ? "global" : ""}`}>
            <div className="site-left-side-header">
                <img src={Images.chartLogo} alt="Chart Logo" />
                <div className={`site-left-side-header-text-box ${isEmpty ? "global" : ""}`}>
                    <p>Chart - {isEmpty ? "Total Values" : (chartType === "monthly" ? "Monthly Increase" : "Daily Increase")}</p>
                    {!isEmpty ? <p onClick={() => switchChartType()} className="chart-switch-text">Switch to {chartType === "monthly" ? "Daily" : "Monthly"}</p> : null}
                </div>
            </div>
            <Chart isCountryEmpty={isEmpty} montlyChart={chartType === "monthly" ? true : (isEmpty ? true : false)}/>
            <div className={`bottom-api-text ${isEmpty ? "global" : ""}`}>
                This site is using <a href="https://covid19api.com" target="_blank" rel="noreferrer">api.covid19api.com</a> for get coronavirus data.<br />
                <span style={{color: "#F53B57"}}>The Recovered values can be incorrect cause API</span>
            </div>
        </div>
    )
}

export default ChartInfoContent;