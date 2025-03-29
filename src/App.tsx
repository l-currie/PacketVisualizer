import { invoke } from "@tauri-apps/api/core";
import React, { useEffect, useRef, useState } from "react";
import useCpuData, { CpuData } from "./hooks/useCpuData";
import * as d3 from "d3";
interface ProcessInfo {
  id: string;
  name: string;
}

export default function App() {
  const { cpuData } = useCpuData();
  const [cpuUsageArr, setCpuUsageArr] = useState<[number, number][]>([[0, 0]]);
  const [osName, setOsName] = useState<string>("");
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);

  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (cpuData) {
      setCpuUsageArr((prev) => {
        const newData: [number, number][] = [...prev, [prev.length, cpuData.usage]];
        return newData.slice(-20);
      });
    }
  }, [cpuData]);

  useEffect(() => {
    const gWidth = 200;
    const gHeight = 200;

    const xScale = d3.scaleLinear().domain([0, 20]).range([0, gWidth]);
    const yScale = d3.scaleLinear().domain([0, 100]).range([gHeight, 0]);

    const line = d3
      .line()
      .x((d, i) => xScale(i))
      .y((d, i) => yScale(d[1]));

    const svg = d3.select(svgRef.current).attr("width", gWidth).attr("height", gHeight);
    svg.selectAll("*").remove();

    svg.append("rect").attr("width", 500).attr("height", 400).attr("fill", "#0b0c0b"); // Set the background color here

    svg
      .append("path")
      .data([cpuUsageArr])
      .attr("class", "cpu-line")
      .attr("d", (d) => line(d))
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 3);

    svg.append("g").attr("transform", `translate(0,${gHeight})`).call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));
  }, [cpuUsageArr]);

  return (
    <div className="container">
      <div className="cpuContainer">
        <div>{cpuData.brand}</div>
        <div>{cpuData.name}</div>
        <div>{cpuData.frequency}</div>
        <div>{cpuData.usage}</div>
        <h3>Usage: </h3>
        <div>
          {cpuUsageArr.map((u, index) => (
            <div key={index}>{u[1]}</div>
          ))}
        </div>
      </div>
      <svg ref={svgRef}></svg>
    </div>
  );
}
