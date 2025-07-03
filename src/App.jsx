import {useCallback, useEffect, useState, useContext} from 'react'
import {useSearchParams} from "react-router-dom";
import isEqual from "lodash/isEqual.js";
import {prepareMultiLineRechartData} from "./utils/prepareRechartData.js";
import LineGraph from "./components/LineGraph.jsx";
import SingleGearSet from "./components/SingleGearSet.jsx";
import BuildTable from "./components/BuildTable.jsx";
import {urlParamsParse} from './utils/url.js'
import {calculateGearRatios} from "./utils/calculations.js";
import './App.css'
import {ToastContainer} from "react-toastify";
import {getActiveSet} from "./utils/activeSetManager.js";
import { SettingsContext } from "./contexts/settingsContext.jsx";
import { Tooltip } from 'react-tooltip'

function App() {
    /*
    * Persistent gear sets
    * store in Object, e.g.:
    * {"set A name": {"front": [32, 46], "back": [11, 13, 15, 18, 20, 22, 24, 28, 30, 32, 34, 36]}, "set B name: {"front"...........""}}
    * */

    // States about Gear Sets
    const [gearSetsInUrl, setGearSetsInUrl] = useState({}); // read from URL
    const [activeSet, setActiveSet] = useState({}); // Gears which will be drawn (active )
    const [activeSetRatios, setActiveSetRatios] = useState({}); // Ratios calculated on active gears
    const [rechartAllGears, setRechartAllGears] = useState([]);
    const [rechartUsableGears, setRechartUsableGears] = useState([]);


    // User customizable values
    const {ratioPercentage, setRatioPercentage, crossChaining, setCrossChaining} = useContext(SettingsContext)

    // useEffect(() => {
    //     console.log("Now crosschaining is: ", crossChaining)
    // }, [crossChaining])

    // Loading and parsing related States
    const [loading, setLoading] = useState(false);
    const [isUrlSetsParsed, setIsUrlSetsParsed] = useState(false);
    const [isActiveSetParsed, setIsActiveSetParsed] = useState(false);
    const [queryParameters, setSearchParameters] = useSearchParams();

    // functions to be moved to own utility files
    // Read from history
    const readHistory = () => {
        const history = localStorage.getItem('history');
        return history ? JSON.parse(history) : [];
    }
    // Write to history
    const addToHistory = useCallback((sets) => {
        const currentHistory = readHistory();
        currentHistory.push(sets);
        if (currentHistory.length < 10) {
            localStorage.setItem('history', JSON.stringify(currentHistory.slice(-10)))
        }
    }, []);

    // Get URL params from URL
    useEffect(() => {
        const setsParam = queryParameters.get('sets'); // read .../?sets= to get gear sets
        const excludeCrossChaining = queryParameters.get('ecc'); // read .../?ecc= to get 1 or 0 if Crosschain to be excluded from calculations
        const overlap = queryParameters.get('o'); // read .../?o= to get overlap percentage
        if (setsParam) {
            const parsedUrlParams = urlParamsParse(setsParam) // parse parameters from url
            setGearSetsInUrl(parsedUrlParams); // save parameters
        }

        if (excludeCrossChaining && (Number(excludeCrossChaining) === 0 || Number(excludeCrossChaining) === 1) ) {
            setCrossChaining(Number(excludeCrossChaining) === 1 ? true : false);
        }

        if (overlap && Number(overlap) > 0 && Number(overlap) <= 10 ){
            setRatioPercentage(Math.floor(Number(overlap)))
        }

        setSearchParameters({}, {replace: true}); // clear URL
        setIsUrlSetsParsed(true);

    }, [])


    // Read current active set
    useEffect(() => {
        const result = getActiveSet();
            if (result.success) {
                setActiveSet(result.activeSet)
            }
            setIsActiveSetParsed(true);
    }, [])

    // Store active Set to local storage
    useEffect(() => {
        if (Object.keys(activeSet).length > 0) {
            localStorage.setItem('activeSet', JSON.stringify(activeSet))
        }
        else if (localStorage.getItem('activeSet') !== null) {
            localStorage.removeItem('activeSet');
        }
    }, [activeSet])

    // compare sets in URL and local storage.
    // if both exist, set URL as active, push local storage one to history
    useEffect(() => {
        if (isUrlSetsParsed && isActiveSetParsed && (Object.keys(gearSetsInUrl).length > 0 || Object.keys(activeSet).length > 0)) {
            // If URL contains gear set(s), make it active
            if (Object.keys(gearSetsInUrl).length > 0) {
                // check if sets in URL are same as Active Sets
                const isUrlSameAsStored = isEqual(gearSetsInUrl, activeSet);
                if (!isUrlSameAsStored && Object.keys(activeSet).length > 0) {
                    addToHistory(activeSet);
                }
                setActiveSet(gearSetsInUrl);
            }
        }
    }, [isUrlSetsParsed, isActiveSetParsed, gearSetsInUrl, activeSet, addToHistory]);

    // update activeSet in local storage
    useEffect(() => {
        if (Object.keys(activeSet).length > 0) {
            localStorage.setItem('activeSet', JSON.stringify(activeSet));
        }
    }, [activeSet]);

    // Calculate ratios in an active set
    useEffect(() => {
        // clear if no active sets
        if (Object.keys(activeSet).length === 0) {
            setActiveSetRatios({});
            return;
        }

        const newRatios = {};

        for (const [key, value] of Object.entries(activeSet)){
            newRatios[key] = calculateGearRatios(value.front, value.back, ratioPercentage, crossChaining)
        }
        if (!isEqual(newRatios, activeSetRatios)) {
            setActiveSetRatios(newRatios);
        }

    }, [activeSet, crossChaining, ratioPercentage])

    // format data to be used in Rechart
    useEffect(() => {
        const rechartData = prepareMultiLineRechartData(activeSetRatios)
        setRechartAllGears(rechartData.allRechart)
        setRechartUsableGears(rechartData.usableRechart)
    }, [activeSetRatios])

    // data updating
    const handleUpdateActiveSet = (oldName, newName, newGearData) => {
        // mutable copy
        setActiveSet( prev => {
            const newActiveSet = {...prev};

            // new or old gear data?
            const gearData = newGearData || newActiveSet[oldName]

            // new name provided? If not, generate unique set#N
            let finalName = newName.trim();
            if (finalName.length === 0) {
                let i = 1;
                while (true) {
                    const defaultName = `set#${i}`;
                    if (!newActiveSet.hasOwnProperty(defaultName)) {
                        finalName = defaultName;
                        break;
                    }
                    i++;
                }
            }

            // provided name matches some old and existing name?
            if (oldName !== finalName && newActiveSet.hasOwnProperty(finalName)) {
                finalName = `${finalName}_2`
            }

            // name changed?
            if (oldName !== finalName) {
                delete newActiveSet[oldName];
            }
            // set (new) name and/or new data:
            newActiveSet[finalName] = gearData;
            return newActiveSet;
        })
    }

    // deleting set from active Set
    const handleDeleteFromActiveSet = (name) => {
        setActiveSet(prev => {
            const newActiveSet = {...prev};

            delete newActiveSet[name];

            return newActiveSet;
        })
    }



  return (<>
        <SingleGearSet
            name={''}
            gearSet={{front: [], back: []}}
            updateSet={handleUpdateActiveSet}
            deleteSet={handleDeleteFromActiveSet}
            isTemplate={true}
        />
      {Object.keys(activeSet).length > 0 ? (<><h1 className={'section-title'}>All gears</h1><p className="section-description">
          Every possible front-rear gear combo, including identical and awkward cross-chained ones. Useful for spotting total range and gear spacing.
      </p></>) : ""}
        <BuildTable activeSetRatios={activeSetRatios} usableRatiosOnly={false}/>
        <div style={{width: '100%', height: 400}}>
            {rechartAllGears.length > 0 ? <LineGraph data={rechartAllGears}/> : ""}
        </div>
      {/* Table and graph with all available gears */}
      {Object.keys(activeSet).length > 0 ?
          (<>
              <h1 className={'section-title'}>Usable gears</h1>
              <p className="section-description">
                  A filtered view showing only clean, usable gears{crossChaining ? (' and cross-chaining excluded') : ''}. Focused on what's actually ridden.
              </p>
          </>) :
          ""}
      <BuildTable activeSetRatios={activeSetRatios} usableRatiosOnly={true}/>
        <div style={{width: '100%', height: 400}}>
            {rechartAllGears.length > 0 ? <LineGraph data={rechartUsableGears}/> : ""}
        </div>
      <ToastContainer/>
      {Object.keys(activeSet).length > 0 ? (<><h1 className={'section-title'}>Sets</h1><p className="section-description">
          Setups in comparison. Add, edit, rename or remove any, to update tables and graphs above.
      </p></>) : ""}
      {Object.keys(activeSet).map(set => <SingleGearSet
          key={set}
          name={set}
          gearSet={activeSet[set]}
          updateSet={handleUpdateActiveSet}
          deleteSet={handleDeleteFromActiveSet}
      />)}
      <Tooltip id="ratio-tooltip" />
      <Tooltip id="explanation-tooltip" />
      </>)
}

export default App
