export type DataPoint = {
    Time: number;
    Open: number;
    High: number;
    Low: number;
    Close: number;
    TickVolume: number;
};

export type Chunk = {
    ChunkStart: number;
    Bars: DataPoint[] | [];
};

export type BarsContextType = {
    data: DataPoint[] | [];
    error: string | null;
    loading: boolean;
};


