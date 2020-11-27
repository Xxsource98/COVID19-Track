import React, { useEffect, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'

// Components
import Input from '../Input/Input'
import Widget from '../Widget/widget'
import * as Images from '../../Images/images'
import { covidContext } from '../../App'

// Style
import './CovidInfoContent.scss'

const CovidInfoContent = () => {
    const { covidData, setCovidData, summariseArray, setSummariseArray, currentCountry } = useContext(covidContext);
    const { country } = useParams();
    const isEmpty = country === "" || country === undefined;

    const updateData = async (url) => {
        const fetchData = await fetch(url);
        const res = fetchData.json();

        return res;
    }

    const calculateIncrease = (yesterday, today) => {
        let newValue = String(today - yesterday);

        if (newValue < 0) {
            newValue = `${newValue}`
        } else {
            newValue = `+${newValue}`
        }

        return newValue;
    }

    const calculateGlobalDifference = (yesterday, today) => {
        return (today - yesterday);
    }

    useEffect(() => {
        window.scrollTo({
            behavior: "smooth",
            top: 0
        })

        updateData(`https://api.covid19api.com/summary`).then(data => setSummariseArray(data)).catch(e => console.log(`Error: ${e}`));

        if (!isEmpty) {
            const date = new Date;
            updateData(`https://api.covid19api.com/country/${country}?from=${date.getFullYear()}-01-01T00:00:00Z&to=${date.getFullYear()}-${String(date.getMonth() + 1).length === 1 ? `0${date.getMonth()}` : date.getMonth() + 1}-${String(date.getDate() + 1).length === 1 ? `0${date.getDate()}` : date.getDate() + 1}T00:00:00Z`)
            .then(data => setCovidData(data))
            .catch(e => console.log(`Error: ${e}`));
        }
    }, []);

    const calculateDifference = (yesterday, today, covidData, type) => {
        const todayDate = new Date(today);
        const yesterDate = new Date(yesterday);
        var yesterdayValue = 0;
        var todayValue = 0;
        const updateType = type === "Infected" ? "Infected" : type === "Recovered" ? "Recovered" : "Deaths";

        if (covidData !== undefined) {
            for (const e of covidData) {
                const eDate = new Date(e.Date);

                if (eDate.getDate() === yesterDate.getDate() && eDate.getMonth() === yesterDate.getMonth() && eDate.getFullYear() === yesterDate.getFullYear()) {
                    yesterdayValue = updateType === "Infected" ? e.Confirmed : updateType === "Recovered" ? e.Recovered : e.Deaths;
                }
                if (eDate.getDate() === todayDate.getDate() && eDate.getMonth() === todayDate.getMonth() && eDate.getFullYear() === todayDate.getFullYear()) {
                    todayValue = updateType === "Infected" ? e.Confirmed : updateType === "Recovered" ? e.Recovered : e.Deaths;
                }
            }
        }

        return (todayValue - yesterdayValue) > 0 ? todayValue - yesterdayValue : yesterdayValue - todayValue;
    }

    const updateObject = (type, data) => {
        const today = new Date;
        today.setDate(today.getDate() - 1);
        var yesterDayActive = 0;
        var preYesterdayActive = 0;
        var newObject = {};
        const updateType = type === "Infected" ? "Infected" : type === "Recovered" ? "Recovered" : "Deaths";
        const yesterday = new Date;
        const preYesterdayDate = new Date;
        yesterday.setDate(today.getDate() - 1)
        preYesterdayDate.setDate(yesterday.getDate() - 1);

        const isAnyElementHasProvince = () => {
            for (const e of data) {
                if (e.Province !== "") {
                    return true;
                }
            }
            return false;
        }

        if (data === undefined) {
            return newObject;
        }

        /* Check if api element has provinces, because every province has same data */
        if (isAnyElementHasProvince()) {
            let finishedProvinces = [];
            let totalAmount = 0;
            let yesterdayAmount = 0;
            let preYesterdayAmount = 0;
            
            for (let i = data.length - 1; i >= 0; i--) {
                const e = data[i];

                const typeForFind = updateType === "Infected" ? e.Confirmed : updateType === "Recovered" ? e.Recovered : e.Deaths;
                const eDate = new Date(e.Date);
                const lastDayOfTheMonth = new Date(eDate.getFullYear(), eDate.getMonth(), 0);
                
                const isDateLastDay =       eDate.getFullYear() === lastDayOfTheMonth.getFullYear() &&
                                            eDate.getMonth() - 1 === lastDayOfTheMonth.getMonth() &&
                                            eDate.getDate() === lastDayOfTheMonth.getDate();

                const isDateYesterday =     eDate.getFullYear() === yesterday.getFullYear() &&
                                            eDate.getMonth()  === yesterday.getMonth() &&
                                            eDate.getDate() === yesterday.getDate();

                const isDatePreYesterday =  eDate.getFullYear() === preYesterdayDate.getFullYear() &&
                                            eDate.getMonth()  === preYesterdayDate.getMonth() &&
                                            eDate.getDate() === preYesterdayDate.getDate();

                const isDateToday =         eDate.getFullYear() === today.getFullYear() &&
                                            eDate.getMonth() - 1 === today.getMonth() - 1 &&
                                            eDate.getDate() === today.getDate()


                if (isDatePreYesterday) {
                    preYesterdayAmount += typeForFind;
                }

                if (isDateYesterday) {
                    yesterdayAmount += typeForFind;
                }

                if (isDateToday && !isDateLastDay) {
                    totalAmount += typeForFind;
                    finishedProvinces.push(e.Province);
                }
                                        
                if (isDateLastDay) {
                    if (finishedProvinces.indexOf(e.Province) === -1) {
                        totalAmount += typeForFind;
                        finishedProvinces.push(e.Province);
                    } 
                }                 
            }

            const increase = calculateIncrease(yesterdayAmount, totalAmount);
            const isIncreaseBetterThanYesterdayInfectsDeaths = calculateDifference(yesterday, today, data, updateType) < calculateDifference(preYesterdayDate, yesterday, data, updateType);
            const isIncreaseBetterThanYesterdayRecoveries = calculateDifference(yesterday, today, data, updateType) > calculateDifference(preYesterdayDate, yesterday, data, updateType);

            newObject = {
                total: totalAmount,
                today: calculateIncrease(yesterdayAmount, totalAmount),
                yesterday: Math.sign(yesterdayAmount - preYesterdayAmount) === -1 ? yesterdayAmount - preYesterdayAmount : String(`+${yesterdayAmount - preYesterdayAmount}`),
                increase: increase,
                betterSituation: updateType === "Recovered" ? isIncreaseBetterThanYesterdayRecoveries : isIncreaseBetterThanYesterdayInfectsDeaths
            };
        } else {
            for (const e of data) {
                const eDate = new Date(e.Date);

                if (eDate.getDate() === preYesterdayDate.getDate() && eDate.getMonth() === preYesterdayDate.getMonth() && eDate.getFullYear() === preYesterdayDate.getFullYear()) {        
                    preYesterdayActive = updateType === "Infected" ? e.Confirmed : updateType === "Recovered" ? e.Recovered : e.Deaths;
                }

                if (eDate.getDate() === yesterday.getDate() && eDate.getMonth() === yesterday.getMonth() && eDate.getFullYear() === yesterday.getFullYear()) {      
                    yesterDayActive = updateType === "Infected" ? e.Confirmed : updateType === "Recovered" ? e.Recovered : e.Deaths;
                }
                
                if (eDate.getDate() === today.getDate() && eDate.getMonth() === yesterday.getMonth()  && eDate.getFullYear() === today.getFullYear()) {
                    const preYesterday = new Date(yesterday);
                    preYesterday.setDate(preYesterday.getDate() - 1);
                    const totalValue = updateType === "Infected" ? e.Confirmed : updateType === "Recovered" ? e.Recovered : e.Deaths;
                    const increase = calculateIncrease(yesterDayActive, totalValue);
                    const isIncreaseBetterThanYesterdayInfectsDeaths = calculateDifference(yesterday, today, data, updateType) < calculateDifference(preYesterdayDate, yesterday, data, updateType);
                    const isIncreaseBetterThanYesterdayRecoveries = calculateDifference(yesterday, today, data, updateType) > calculateDifference(preYesterdayDate, yesterday, data, updateType);

                    newObject = {
                        total: totalValue,
                        today: Math.sign(calculateDifference(yesterday, today, data, updateType) === -1) ? calculateDifference(yesterday, today, data, updateType) : String(`+${calculateDifference(yesterday, today, data, updateType)}`),
                        yesterday: Math.sign(yesterDayActive - preYesterdayActive) === -1 ? yesterDayActive - preYesterdayActive : String(`+${yesterDayActive - preYesterdayActive}`),
                        increase: increase,
                        betterSituation: updateType === "Recovered" ? isIncreaseBetterThanYesterdayRecoveries : isIncreaseBetterThanYesterdayInfectsDeaths
                    }
                } else continue;
            }
        }

        return newObject;
    }

    const updateGlobalObject = (type, data) => {
        var newObject = {
            total: -1,
            today: -1,
            yesterday: -1,
            increase: '-',
            betterSituation: false
        };
        const updateType = type === "Infected" ? "Infected" : type === "Recovered" ? "Recovered" : "Deaths";

        if (data.Global === undefined) {
            return newObject;
        }
        else {
            const total = updateType === "Infected" ? data.Global.TotalConfirmed : updateType === "Recovered" ? data.Global.TotalRecovered : data.Global.TotalDeaths;
            const today = updateType === "Infected" ? data.Global.NewConfirmed : updateType === "Recovered" ? data.Global.NewRecovered : data.Global.NewDeaths;
            const yesterday = calculateGlobalDifference(today, total);
            const increase = calculateIncrease(0, today);
    
            newObject = {
                total: total,
                today: today,
                yesterday: yesterday,
                increase: increase,
                betterSituation: Math.sign(calculateGlobalDifference(yesterday, total) === -1)
            }
        }

        return newObject;
    }

    const calculateActivePeople = (data, countryToFind) => {
        if (data.Global === undefined)
            return 0;
            
        const allCountries = data.Countries;
        for (const country of allCountries) {
            if (country.Slug === countryToFind) {
                const totalInfected = country.TotalConfirmed;
                const totalRecovered = country.TotalRecovered;
                return totalInfected - totalRecovered;
            } else continue;
        }

        return 0;
    }

    const calculateGlobalActivePeople = (data) => {
        if (data.Global === undefined)
            return 0;

        const totalInfected = data.Global.TotalConfirmed;
        const totalRecovered = data.Global.TotalRecovered;

        return totalInfected - totalRecovered;
    }

    const infectedData = isEmpty ? updateGlobalObject("Infected", summariseArray) : updateObject("Infected", covidData);
    const recoveredData = isEmpty ? updateGlobalObject("Recovered", summariseArray) : updateObject("Recovered", covidData);
    const deathsData = isEmpty ? updateGlobalObject("Deaths", summariseArray) : updateObject("Deaths", covidData);
    const activePeople = isEmpty ? calculateGlobalActivePeople(summariseArray) : calculateActivePeople(summariseArray, country);


    return (
        <div className="covid-info-content" onClick={e => {
            const selector = document.querySelector("#country-input");
            if (e.nativeEvent.target === selector) {
                document.querySelector(".input-container").classList.add("opened");
            } else {
                document.querySelector(".input-container").classList.remove("opened");
            }
        }}>
            <Input/>
            <div className="selected-country">Selected Country: <span>{currentCountry === "" ? country === undefined ? "Global" : country : currentCountry}</span></div>
            <div className="widgets-container">
                <Widget 
                    iconImage={Images.infectLogo}
                    widgetTitle="Infected"
                    totalAmount={infectedData.total }
                    todayAmount={infectedData.today}
                    yesterdayAmount={infectedData.yesterday}
                    todayIncrease={infectedData.increase}
                    betterSituation={infectedData.betterSituation}
                />
                <Widget 
                    iconImage={Images.peopleLogo}
                    widgetTitle="Recovered"
                    totalAmount={recoveredData.total}
                    todayAmount={recoveredData.today}
                    yesterdayAmount={recoveredData.yesterday}
                    todayIncrease={recoveredData.increase}
                    betterSituation={recoveredData.betterSituation}
                />
                <Widget 
                    iconImage={Images.deadLogo}
                    widgetTitle="Deaths"
                    totalAmount={deathsData.total}
                    todayAmount={deathsData.today}
                    yesterdayAmount={deathsData.yesterday}
                    todayIncrease={deathsData.increase}
                    betterSituation={deathsData.betterSituation}
                />
            </div>
            <div className="active-people">Active People: <span>{activePeople}</span></div>
            <img src={Images.arrowDown} alt="Arrow Down" className="arrow-down" onClick={() => document.querySelector(".chart-info-content").scrollIntoView({ behavior: "smooth" })}/>
        </div>
    )
}

export default CovidInfoContent;