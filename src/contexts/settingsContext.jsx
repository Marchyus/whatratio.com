import {createContext, useState} from "react";

export const SettingsContext = createContext();

export function SettingsProvider ({children}) {
    // User customizable values
    const [ratioPercentage, setRatioPercentage] = useState(5); // user defined value, what % is acceptable
    const [crossChaining, setCrossChaining] = useState(true); // calculate or ignore crosschaining (max to max and min to min)

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