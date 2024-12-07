import { FC, useEffect, useRef, useState } from "react";
import {Chunk} from "../Types.ts";

const OHLCChartZoom: FC<Chunk> = ({ Bars }) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const barsLength: number = Bars.length === 0 ? 0 : Bars.length - 1;
    const [zoomRange, setZoomRange] = useState<[number, number]>([0, Bars.length]);
    const [selection, setSelection] = useState<{ startX: number; endX: number } | null>(null);

    const [ width ] = useState(window.innerWidth);
    const [ height ] = useState(window.innerHeight);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && Bars) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                const width = canvas.width;
                const height = canvas.height;
                const margin = 50;

                const chartWidth = width - 2 * margin;
                const chartHeight = height - 2 * margin;

                // Get zoomed data
                const zoomedData = Bars.slice(zoomRange[0], zoomRange[1] + 1);
                const times = zoomedData.map((d) => d.Time);
                const prices = zoomedData.flatMap((d) => [d.High, d.Low]);
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);

                const xScale = chartWidth / (times.length - 1);
                const yScale = chartHeight / (maxPrice - minPrice);

                const mapY = (price: number) =>
                    height - margin - (price - minPrice) * yScale;

                // Clear canvas
                ctx.clearRect(0, 0, width, height);

                // Draw background
                ctx.fillStyle = "#f9f9f9";
                ctx.fillRect(0, 0, width, height);

                // Draw grid lines
                ctx.strokeStyle = "#ddd";
                ctx.lineWidth = 0.5;
                for (let i = 0; i <= 10; i++) {
                    const y = margin + (chartHeight / 10) * i;
                    ctx.beginPath();
                    ctx.moveTo(margin, y);
                    ctx.lineTo(width - margin, y);
                    ctx.stroke();
                }

                // Draw axes
                ctx.strokeStyle = "#333";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(margin, margin);
                ctx.lineTo(margin, height - margin);
                ctx.lineTo(width - margin, height - margin);
                ctx.stroke();

                // Draw OHLC bars
                zoomedData.forEach((d, i) => {
                    const x = margin + i * xScale;
                    const openY = mapY(d.Open);
                    const closeY = mapY(d.Close);
                    const highY = mapY(d.High);
                    const lowY = mapY(d.Low);

                    // Draw high-low line
                    ctx.strokeStyle = "#000";
                    ctx.beginPath();
                    ctx.moveTo(x, highY);
                    ctx.lineTo(x, lowY);
                    ctx.stroke();

                    // Draw open-close rectangle
                    const isBullish = d.Close > d.Open;
                    ctx.fillStyle = isBullish ? "rgba(0, 255, 0, 0.8)" : "rgba(255, 0, 0, 0.8)";
                    const barWidth = 10;
                    ctx.fillRect(
                        x - barWidth / 2,
                        isBullish ? closeY : openY,
                        barWidth,
                        Math.abs(openY - closeY)
                    );
                });

                const yStep = (maxPrice - minPrice) / 10;
                ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                for (let i = 0; i <= 10; i++) {
                    const price = minPrice + i * yStep;
                    const y = mapY(price);
                    ctx.fillText(price.toFixed(5), margin - 40, y);
                    ctx.beginPath();
                    ctx.moveTo(margin, y);
                    ctx.lineTo(canvas.width - margin, y);
                    ctx.strokeStyle = '#ddd';
                    ctx.stroke();
                }


                // Draw selection area
                if (selection) {
                    ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
                    const startX = Math.min(selection.startX, selection.endX);
                    const endX = Math.max(selection.startX, selection.endX);
                    ctx.fillRect(startX, margin, endX - startX, chartHeight);
                }
            }
        }
    }, [Bars, zoomRange, selection]);

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const startX = event.clientX - rect.left;
            setSelection({ startX, endX: startX });
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (selection) {
            const canvas = canvasRef.current;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const endX = event.clientX - rect.left;
                setSelection({ ...selection, endX });
            }
        }
    };

    const handleMouseUp = () => {
        if (selection) {
            const canvas = canvasRef.current;
            if (canvas) {
                //const rect = canvas.getBoundingClientRect();
                const margin = 50;
                const chartWidth = canvas.width - 2 * margin;

                const startX = Math.min(selection.startX, selection.endX);
                const endX = Math.max(selection.startX, selection.endX);

                const startIndex = Math.floor(((startX - margin) / chartWidth) * (zoomRange[1] - zoomRange[0] + 1)) + zoomRange[0];
                const endIndex = Math.floor(((endX - margin) / chartWidth) * (zoomRange[1] - zoomRange[0] + 1)) + zoomRange[0];

                setZoomRange([Math.max(0, startIndex), Math.min(barsLength, endIndex)]);
            }
        }
        setSelection(null);
    };

    const handleDoubleClick = () => {
        setZoomRange([0, barsLength]); // Reset zoom on double click
    };

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{ border: "1px solid #ddd", borderRadius: "8px", cursor: "crosshair" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
        />
    );
};

export default OHLCChartZoom;
