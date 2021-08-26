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
    isCountryEmpty = false,
    montlyChart = true
}) => {
    const { covidData, summariseArray  } = useContext(covidContext);    

    const generateMonthDaysArray = (month) => {
        const currentMonthDays = new Date(new Date().getFullYear(), month, 0).getDate();
        let newArray = [];

        for (let i = 0; i < currentMonthDays; i++)
        {
            newArray.push(i + 1);
        }

        return newArray;
    }

    const getPreviousDateData = (currentDate) => {
        let dateBefore = new Date(currentDate);
        dateBefore.setDate(dateBefore.getDate() - 1);

        return dateBefore;
    }

    const calculateSumOfPeople = (month, updateType) => {
        /* Getting last month and current month amounts and decrease it for get monthly increase */
        let curDate = new Date(new Date().getFullYear(), month - 1);
        let prevDate = getPreviousDateData(curDate);
        let monthSum = 0;
        let prevMonthValue = 0;
        let isProvince = false;

        if (covidData.message !== undefined) {
            return 0;
        }

        for (const data of covidData) {
            if (data.Province !== "") {
                isProvince = true;
                break;
            }

            let covidDate = new Date(data.Date);
            const typeForFind = updateType === "Infected" ? data.Confirmed : updateType === "Recovered" ? data.Recovered : data.Deaths;

            if (covidDate.getMonth() === prevDate.getMonth()) {
                prevMonthValue = typeForFind;
            }

            if (covidDate.getMonth() === curDate.getMonth()) {
                if (updateType === "Recovered") { // I did this, because API has broken Recovered count 
                    if (data.Recovered === 0) {
                        monthSum = 0;
                    }
                }
                else { 
                    monthSum = typeForFind - prevMonthValue;
                }
            }
        }

        if (isProvince && updateType !== "Recovered") {
            let provinceDayValues = [];
            let checkedProvinces = [];
            let allCurrentDateProvinces = [];
            let allPrevDateProvinces = [];

            for (const data of covidData) {
                const covidDate = new Date(data.Date);

                if (covidDate.getMonth() === prevDate.getMonth()) {
                    allPrevDateProvinces.push(data);
                }
    
                if (covidDate.getMonth() === curDate.getMonth()) {
                    allCurrentDateProvinces.push(data);
                }
            }   

            for (const prevDate of allPrevDateProvinces) {
                const prevDataType = updateType === "Infected" ? prevDate.Confirmed : updateType === "Recovered" ? prevDate.Recovered : prevDate.Deaths;

                if (checkedProvinces.indexOf(prevDate.Province) === -1) {
                    for (const curDate of allCurrentDateProvinces) {
                        if (curDate.Province === prevDate.Province) {
                            const curDataType = updateType === "Infected" ? curDate.Confirmed : updateType === "Recovered" ? curDate.Recovered : curDate.Deaths;
 
                            provinceDayValues.push(curDataType - prevDataType);
                            checkedProvinces.push(prevDate.Province);
                        } else continue;
                    }
                }
            }

            if (checkedProvinces.length > 0) {
                for (const val of provinceDayValues) {
                    monthSum += val;
                }
            }
        }
        
        return monthSum;
    }

    const calculateMonthSumOfPeople = (day, month, updateType) => {
        let curDate = new Date(new Date().getFullYear(), month, day);
        let prevDate = getPreviousDateData(curDate);
        let daySum = 0;
        let prevDayValue = 0;
        let isProvince = false;

        if (covidData.message !== undefined) {
            return 0;
        }

        for (const data of covidData) {
            if (data.Province !== "") {
                isProvince = true;
                break;
            }

            let covidDate = new Date(data.Date);
            const typeForFind = updateType === "Infected" ? data.Confirmed : updateType === "Recovered" ? data.Recovered : data.Deaths;

            if (covidDate.getMonth() === prevDate.getMonth()) {
                if (covidDate.getDate() === prevDate.getDate()) {
                    prevDayValue = typeForFind;
                }
            }

            if (covidDate.getMonth() === curDate.getMonth()) {
                if (covidDate.getDate() === curDate.getDate()) {
                    if (updateType === "Recovered") { // I did this, because API has broken Recovered count 
                        if (data.Recovered === 0) {
                            daySum = 0;
                        }
                    }
                    else daySum = typeForFind - prevDayValue;
                }
            }
        }

        if (isProvince && updateType !== "Recovered") {
            let provinceDayValues = [];
            let checkedProvinces = [];
            let allCurrentDateProvinces = [];
            let allPrevDateProvinces = [];

            for (const data of covidData) {
                const covidDate = new Date(data.Date);

                if (covidDate.getMonth() === prevDate.getMonth()) {
                    if (covidDate.getDate() === prevDate.getDate()) {
                        allPrevDateProvinces.push(data);
                    }
                }
    
                if (covidDate.getMonth() === curDate.getMonth()) {
                    if (covidDate.getDate() === curDate.getDate()) {
                        allCurrentDateProvinces.push(data);
                    }
                }
            }   

            for (const prevDate of allPrevDateProvinces) {
                const prevDataType = updateType === "Infected" ? prevDate.Confirmed : updateType === "Recovered" ? prevDate.Recovered : prevDate.Deaths;

                if (checkedProvinces.indexOf(prevDate.Province) === -1) {
                    for (const curDate of allCurrentDateProvinces) {
                        if (curDate.Province === prevDate.Province) {
                            const curDataType = updateType === "Infected" ? curDate.Confirmed : updateType === "Recovered" ? curDate.Recovered : curDate.Deaths;
 
                            provinceDayValues.push(curDataType - prevDataType);
                            checkedProvinces.push(prevDate.Province);
                        } else continue;
                    }
                }
            }

            if (checkedProvinces.length > 0) {
                for (const val of provinceDayValues) {
                    daySum += val;
                }
            }
        }

        return daySum;
    }

    const RenderChart = () => {
        let data = {};

        const options = {
            maintainAspectRatio: false,
        }

        const createMonthDataArray = (type) => {
            let array = [];
            const date = new Date();
            const dayCount = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

            for (let i = 0; i < dayCount; i++)
            {
                array.push(calculateMonthSumOfPeople(i + 1, date.getMonth(), type));
            }

            return array;

        }

        if (montlyChart) {// Montly Chart
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

                console.log('t')
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
            }
        }
        else // Daily Chart
        {
            data = {
                labels: generateMonthDaysArray(new Date().getMonth()),
                datasets: [
                    {
                        label: "Infected People",
                        data: createMonthDataArray("Infected"),
                        fill: false,
                        backgroundColor: chart_dot,
                        borderColor: chart_infected
                    },
                    {
                        label: "Recovered People",
                        data: createMonthDataArray("Recovered"),
                        fill: false,
                        backgroundColor: chart_dot,
                        borderColor: chart_recovered
                    },
                    {
                        label: "Dead People",
                        data: createMonthDataArray("Deaths"),
                        fill: false,
                        backgroundColor: chart_dot,
                        borderColor: chart_dead
                    }
                ]
            }
        }    

        return (
            <Line data={data} height={"600"} options={options} />
        )
    }

    return (
        <div className="site-chart-container">
            <RenderChart/>
        </div>
    )
}


export default Chart;