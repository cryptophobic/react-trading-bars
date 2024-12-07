import {createContext, useContext} from "react";
import { BarsContextType } from "../Types.ts";

export const BarsContext = createContext<BarsContextType | null>(null);

export const useBars = (): BarsContextType => {
    const context = useContext(BarsContext);
    if (!context) {
        throw new Error("useBars must be used within a BarsJsonProvider");
    }
    return context;
};