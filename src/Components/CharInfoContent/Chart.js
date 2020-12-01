import React, { useContext } from 'react'

// Components
import { Line, HorizontalBar } from 'react-chartjs-2'
import { covidContext } from '../../App'

const chart_dot = "#1e272e";
const chart_recovered = "#05C46B";
const chart_dead = "#F53B57";
const chart_infected = "#0fbcf9";
const chart_active = "#575fcf";

const Chart = ({
    isCountryEmpty = false
}) => {
    const { covidData, summariseArray  } = useContext(covidContext);    

    const calculateSumOfPeople = (month, type) => {
        /* Getting last month and current month amounts and decrease it for get monthly increase */
        var lastMonth = 0;
        var thisMonth = 0;
        const today = new Date;
        today.setDate(today.getDate() - 1);
        today.setMonth(month - 1);
        const updateType = type === "Infected" ? "Infected" : type === "Recovered" ? "Recovered" : "Deaths";

        const isAnyElementHasProvince = () => {
            for (const e of covidData) {
                if (e.Province !== "") {
                    return true;
                }
            }
            return false;
        }

        /* Check if api element has provinces, because every province has same data */
        if (isAnyElementHasProvince()) {
            let finishedProvinces = [];
            
            for (let i = covidData.length - 1; i >= 0; i--) {
                const e = covidData[i];

                const date = new Date(e.Date);
                const lastDayOfMonth = new Date(date.getFullYear(), month - 1, 0);
                const typeForFind = updateType === "Infected" ? e.Confirmed : updateType === "Recovered" ? e.Recovered : e.Deaths;

                if (date.getFullYear() === today.getFullYear()) {
                    if (date.getMonth() === (month - 2)) { // Last Month
                        if (date.getDate() === lastDayOfMonth.getDate()) {
                            lastMonth += typeForFind;
                        }
                    }

                    if (date.getMonth() === (month - 1)) { // Current Month
                        if (today.getDate() !== lastDayOfMonth.getDate()) {
                            if (finishedProvinces.indexOf(e.Province) === -1) { 
                                thisMonth += typeForFind;
                                finishedProvinces.push(e.Province);
                            }
                        } else {
                            if (finishedProvinces.indexOf(e.Province) === -1) { 
                                thisMonth += typeForFind;
                                finishedProvinces.push(e.Province);
                            }
                        }
                    }
                } else continue;
            }
        } else {
            for (const e of covidData) {
                const date = new Date(e.Date);
                const lastDayOfMonth = new Date(date.getFullYear(), month - 1, 0);

                if (date.getFullYear() === today.getFullYear()) {
                    if (date.getMonth() === (month - 2)) { // Last Month
                        if (date.getDate() === lastDayOfMonth.getDate()) {
                            lastMonth = updateType === "Infected" ? e.Confirmed : updateType === "Recovered" ? e.Recovered : e.Deaths;
                        }
                    }
                    if (date.getMonth() === (month - 1)) { // Current Month
                        if (today.getDate() !== lastDayOfMonth.getDate()) {
                            thisMonth = updateType === "Infected" ? e.Confirmed : updateType === "Recovered" ? e.Recovered : e.Deaths;
                        } else {
                            thisMonth = updateType === "Infected" ? e.Confirmed : updateType === "Recovered" ? e.Recovered : e.Deaths;
                        }
                    }
                } else continue;
            }
        }

        /* avoid incorrect value with empty month */
        return (thisMonth - lastMonth) === -lastMonth ? 0 : thisMonth - lastMonth;
    }

    const RenderChart = () => {
        let data = {};

        const options = {
            maintainAspectRatio: false,
        }

        if (isCountryEmpty) {
            const mappedCountries = summariseArray.Countries.map(e => { return e.Country });
            const totalInfectedData = summariseArray.Countries.map(e => { return e.TotalConfirmed });
            const activeInfectedData = summariseArray.Countries.map(e => { return e.TotalConfirmed - e.TotalRecovered });
            const recoveredData = summariseArray.Countries.map(e => { return e.TotalRecovered });
            const deathsData = summariseArray.Countries.map(e => { return e.TotalDeaths });

            data = {
                labels: mappedCountries,
                datasets: [
                    {
                        label: "Total Infected People",
                        data: totalInfectedData,
                        fill: false,
                        backgroundColor: chart_active,
                    },
                    {
                        label: "Active Infected People",
                        data: activeInfectedData,
                        fill: false, 
                        backgroundColor: chart_infected,
                    },
                    {
                        label: "Recovered People",
                        data: recoveredData,
                        fill: false,
                        backgroundColor: chart_recovered,
                    },
                    {
                        label: "Dead People",
                        data: deathsData,
                        fill: false,
                        backgroundColor: chart_dead,
                    }
                ]
            };

            return (
                <HorizontalBar data={data} height={"600"} options={options} />
            )
        } else {
            data = {
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                datasets: [
                    {
                        label: "Infected People",
                        data: [
                            calculateSumOfPeople(1, "Infected"),
                            calculateSumOfPeople(2, "Infected"),
                            calculateSumOfPeople(3, "Infected"),
                            calculateSumOfPeople(4, "Infected"),
                            calculateSumOfPeople(5, "Infected"),
                            calculateSumOfPeople(6, "Infected"),
                            calculateSumOfPeople(7, "Infected"),
                            calculateSumOfPeople(8, "Infected"),
                            calculateSumOfPeople(9, "Infected"),
                            calculateSumOfPeople(10, "Infected"),
                            calculateSumOfPeople(11, "Infected"),
                            calculateSumOfPeople(12, "Infected")       
                        ],
                        fill: false,
                        backgroundColor: chart_dot,
                        borderColor: chart_infected
                    },
                    {
                        label: "Recovered People",
                        data: [
                            calculateSumOfPeople(1, "Recovered"),
                            calculateSumOfPeople(2, "Recovered"),
                            calculateSumOfPeople(3, "Recovered"),
                            calculateSumOfPeople(4, "Recovered"),
                            calculateSumOfPeople(5, "Recovered"),
                            calculateSumOfPeople(6, "Recovered"),
                            calculateSumOfPeople(7, "Recovered"),
                            calculateSumOfPeople(8, "Recovered"),
                            calculateSumOfPeople(9, "Recovered"),
                            calculateSumOfPeople(10, "Recovered"),
                            calculateSumOfPeople(11, "Recovered"),
                            calculateSumOfPeople(12, "Recovered") 
                        ],
                        fill: false,
                        backgroundColor: chart_dot,
                        borderColor: chart_recovered
                    },
                    {
                        label: "Dead People",
                        data: [
                            calculateSumOfPeople(1, "Deaths"),
                            calculateSumOfPeople(2, "Deaths"),
                            calculateSumOfPeople(3, "Deaths"),
                            calculateSumOfPeople(4, "Deaths"),
                            calculateSumOfPeople(5, "Deaths"),
                            calculateSumOfPeople(6, "Deaths"),
                            calculateSumOfPeople(7, "Deaths"),
                            calculateSumOfPeople(8, "Deaths"),
                            calculateSumOfPeople(9, "Deaths"),
                            calculateSumOfPeople(10, "Deaths"),
                            calculateSumOfPeople(11, "Deaths"),
                            calculateSumOfPeople(12, "Deaths") 
                        ],
                        fill: false,
                        backgroundColor: chart_dot,
                        borderColor: chart_dead
                    }
                ]
            }

            return (
                <Line data={data} height={"600"} options={options} />
            )
        }    
    }

    return (
        <div className="site-chart-container">
            <RenderChart/>
        </div>
    )
}


export default Chart;