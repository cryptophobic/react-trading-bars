import React, {ReactNode, useEffect, useState} from "react";
import {barsLink} from './bars_links.ts';
import {Chunk, DataPoint} from "../Types.ts";
import { BarsContext } from "./UseBars.tsx";

type BarsJsonProviderProps = {
    children: ReactNode;
};

export const BarsJsonProvider: React.FC<BarsJsonProviderProps> = ({ children }) => {
    const [data, setData] = useState<DataPoint[] | []>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBars = async () => {
            try {
                const response = await fetch(barsLink); // Replace with the correct path
                if (!response.ok) {
                    setError(`HTTP error! status: ${response.status}`);
                    setData([]);
                } else {
                    const result: Chunk[] = await response.json();
                    const bars: DataPoint[] = combineBars(result);
                    setData(bars);
                    setError(null);
                }
            } catch (err) {
                setError((err as Error).message);
                setData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBars();
    }, []); // Empty dependency array ensures this runs only once

    /**
     * Combines bars from chunks into a single array of DataPoint objects.
     * @param chunks - Array of chunks containing bars.
     * @returns Combined array of DataPoint objects.
     */
    const combineBars = (chunks: Chunk[]): DataPoint[] => {
        const combined: DataPoint[] = [];
        for (const chunk of chunks) {
            combined.push(...chunk.Bars);
        }
        return combined;
    }

    return (
        <BarsContext.Provider value={{ data, error, loading }}>
            {children}
        </BarsContext.Provider>
    );
};

