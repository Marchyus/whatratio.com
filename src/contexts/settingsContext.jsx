import {createContext, useEffect, useState} from "react";

export const SettingsContext = createContext();

export function SettingsProvider ({children}) {

    const getInitialSettings = () => {
        // set default settings
        const defaultSetSettings = {ecc: true, o: 5};
        // check local storage
        const settingsInStorage = localStorage.getItem('activeSetSettings');
        if (settingsInStorage) {
            try {
                const settingsInJson = JSON.parse(settingsInStorage)
                return {...defaultSetSettings, ...settingsInJson}
            }
            catch (err) {
                console.error("Failed to parse settings from history: ", err);
                console.log("Clearing settings in storage");
                localStorage.removeItem('activeSetSettings');
            }
            return defaultSetSettings;
        }
    }
    // get initial settings OR settings from storage
    const initialSettings = getInitialSettings();

    // User customizable values
    const [ratioPercentage, setRatioPercentage] = useState(initialSettings.o); // user defined value, what % is acceptable
    const [crossChaining, setCrossChaining] = useState(initialSettings.ecc); // calculate or ignore crosschaining (max to max and min to min)

    // always update settings in local storage
    useEffect(() => {
        localStorage.setItem('activeSetSettings', JSON.stringify({ecc: crossChaining, o: ratioPercentage}))
    }, [ratioPercentage, crossChaining])

    return (
        <SettingsContext.Provider value={{
            ratioPercentage,
            setRatioPercentage,
            crossChaining,
            setCrossChaining
        }}>
            {children}
        </SettingsContext.Provider>
    )
}