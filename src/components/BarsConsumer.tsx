import React from "react";
import OHLCChartZoom from "./OHLCChartZoom.tsx";
import {useBars} from "../data/UseBars.tsx";


const BarsConsumer: React.FC = () => {
    const { data, loading, error } = useBars();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <OHLCChartZoom Bars={data} ChunkStart={10} />
        </div>
    );
};

export default BarsConsumer;
