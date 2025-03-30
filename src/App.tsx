import React, { useEffect, useState } from "react";
import useUsageData from "./hooks/useUsageData";
import UsageGraph from "./components/UsageGraph";
import useSystemData from "./hooks/useSystemData";

type HistoicUsageArr = {
  cpuUsage: [number, number][];
  memoryUsage: [number, number][];
};

export default function App() {
  const { usageData } = useUsageData();
  const { cpuData, memoryInfo } = useSystemData();
  const [usageArr, setUsageArr] = useState<HistoicUsageArr>({ cpuUsage: [[0, 0]], memoryUsage: [[0, 0]] });

  useEffect(() => {
    if (usageData) {
      setUsageArr((prev) => {
        const newCpuUsage: [number, number][] = [
          ...prev.cpuUsage,
          [prev.cpuUsage.length, usageData.cpu_usage.average_cpu_usage],
        ];
        const newMemoryUsage: [number, number][] = [
          ...prev.memoryUsage,
          [prev.memoryUsage.length, usageData.memory_usage.used_mem],
        ];

        return { cpuUsage: newCpuUsage.slice(-40), memoryUsage: newMemoryUsage.slice(-40) };
      });
    }
  }, [usageData]);

  return (
    <div className="container">
      <div className="cpuContainer">
        <div>Brand: {cpuData.brand}</div>
        <div>Name: {cpuData.name}</div>
        <div>Frequency: {cpuData.frequency}</div>
        <div>Usage: {usageArr.cpuUsage[usageArr.cpuUsage.length - 1][1]}%</div>
      </div>
      <div className="memoryContainer">
        <div>
          Used: {((usageArr.memoryUsage[usageArr.memoryUsage.length - 1][1] * memoryInfo.total_mem) / 100).toFixed(1)} /{" "}
          {memoryInfo.total_mem.toFixed(1)} Total
        </div>
        <div>Available Memory: {memoryInfo.available_mem}</div>
        <div>Swap: {memoryInfo.total_swap}</div>
        <h3>Usage: </h3>
      </div>
      <UsageGraph usageArr={usageArr.cpuUsage} plotHeight={200} plotWidth={200} />
      <UsageGraph usageArr={usageArr.memoryUsage} plotHeight={200} plotWidth={200} />
    </div>
  );
}
