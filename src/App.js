import React, { useEffect, createContext, useState, useContext } from 'react'
import { HashRouter, Route, Router, Switch, useParams } from 'react-router-dom'

// Components
import Navbar from './Components/Navbar/navbar'
import CovidInfoContent from './Components/CovidInfoContent/CovidInfoContent'
import ChartInfoContent from './Components/CharInfoContent/ChartInfoContent'
import Footer from './Components/Footer/footer'

// Style
import './globalStyle.scss'

export const covidContext = createContext([]);

const App = () => {
    const [ summariseArray, setSummariseArray ] = useState({
        Countries: [ "Not", "Found" ]
    });
    const [ covidData, setCovidData ] = useState([
        {
            Global: {
                TotalConfirmed: -1,
                NewConfirmed: -1,
                TotalRecovered: -1,
                NewRecovered: -1,
                TotalDeaths: -1,
                NewDeaths: -1
            },
            total: -1,
            today: -1,
            yesterday: -1,
            increase: '-',
            betterSituation: false,
        }
    ]);

    return (
        <HashRouter>
            <covidContext.Provider value={{ covidData, setCovidData, summariseArray, setSummariseArray }}>
                <div className="container">
                    <Navbar />
                    <Switch>
                        <Route exact path="/">
                            <CovidInfoContent />
                            <ChartInfoContent />
                        </Route>
                        <Route path="/:country">
                            <CovidInfoContent />
                            <ChartInfoContent />
                        </Route>
                    </Switch>
                    <Footer />
                </div>
            </covidContext.Provider>
        </HashRouter>
    )
}

export default App;