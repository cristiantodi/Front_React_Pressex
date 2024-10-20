import { createContext, useState, useMemo } from "react";
export const GlobalContext = createContext();
export const GlobalProvider = ({ children }) => {


    const [hideShowSlider, setHideShowSlider] = useState(false);

    const [controlSlider, setcontrolSlider] = useState(true);
    const values = useMemo(() => ({
        hideShowSlider,
        setHideShowSlider, controlSlider, setcontrolSlider
    }), 
    [hideShowSlider, setHideShowSlider, controlSlider, setcontrolSlider]);

    return (<GlobalContext.Provider value={values}>{children}</GlobalContext.Provider>)  
}