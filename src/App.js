import React, { createContext, useState } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

// Components
import Navbar from './Components/Navbar/navbar'
import CovidInfoContent from './Components/CovidInfoContent/CovidInfoContent'
import ChartInfoContent from './Components/ChartInfoContent/ChartInfoContent'
import Footer from './Components/Footer/footer'

// Style
import './globalStyle.scss'

export const covidContext = createContext([]);

const App = () => {
    const [ summariseArray, setSummariseArray ] = useState({
        Countries: [ "Not", "Found" ]
    });
    const [ covidData, setCovidData ] = useState([
        /*{
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
        }*/
    ]);
    const [ currentCountry, setCurrentCountry ] = useState("");

    return (
        <HashRouter>
            <covidContext.Provider value={{ covidData, setCovidData, summariseArray, setSummariseArray, currentCountry, setCurrentCountry }}>
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