import React from 'react'

// Style
import './widget.scss'

const Widget = ({
    iconImage = "",
    widgetTitle = "",
    totalAmount = 0,
    todayAmount = 0,
    yesterdayAmount = 0,
    todayIncrease = "",
    betterSituation = true
}) => {
    return (
        <div className="widget">
            <img src={iconImage} alt={widgetTitle} />
            <p className="widget-title">{widgetTitle}</p>
            <p className="widget-info">Total: <span style={{fontWeight: "bold"}}>{totalAmount}</span></p>
            <p className="widget-info">Today: <span style={{fontWeight: "bold"}}>{todayAmount}</span></p>
            <p className="widget-info">Yesterday: <span style={{fontWeight: "bold"}}>{yesterdayAmount}</span></p>
            <p className={`widget-increase ${betterSituation ? 'better' : 'worst'}`} >{todayIncrease}</p>
        </div>
    )
}

export default Widget;