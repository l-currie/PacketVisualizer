import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface UsageGraphProps {
  usageArr: [number, number][];
  plotWidth: number;
  plotHeight: number;
}

export default function UsageGraph({ usageArr, plotWidth, plotHeight }: UsageGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const xScale = d3.scaleLinear().domain([0, 40]).range([0, plotWidth]);
    const yScale = d3.scaleLinear().domain([0, 100]).range([plotHeight, 0]);

    const area = d3
      .area()
      .x((d, i) => xScale(i))
      .y0(yScale(0))
      .y1((d, i) => yScale(d[1]));

    const svg = d3.select(svgRef.current).attr("width", plotWidth).attr("height", plotHeight);
    svg.selectAll("*").remove();

    svg.append("rect").attr("width", 200).attr("height", 200).attr("fill", "#0b0c0b"); // Set the background color here

    svg
      .append("path")
      .data([usageArr])
      .attr("class", "cpu-line")
      .attr("d", (d) => area(d))
      .attr("fill", "steelblue")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 3);

    svg.append("g").attr("transform", `translate(0,${plotHeight})`).call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));
  }, [usageArr]);

  return <svg ref={svgRef}></svg>;
}
