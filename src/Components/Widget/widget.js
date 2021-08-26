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
    const style = { fontWeight: "bold", fontSize: 24 };

    return (
        <div className="widget">
            <img src={iconImage} alt={widgetTitle} />
            <p className="widget-title">{widgetTitle}</p>
            <p className="widget-info">Total: <span style={style}>{totalAmount}</span></p>
            <p className="widget-info">New Cases: <span style={style}>{todayAmount}</span></p>
            <p className="widget-info">Prev. Cases: <span style={style}>{yesterdayAmount}</span></p>
            <p className={`widget-increase ${betterSituation ? 'better' : 'worst'}`} >{todayIncrease}</p>
        </div>
    )
}

export default Widget;