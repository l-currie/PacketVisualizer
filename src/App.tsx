import React, { useEffect, useState } from "react";
import useUsageData from "./hooks/useUsageData";
import UsageGraph from "./components/UsageGraph";
import useSystemData from "./hooks/useSystemData";

type HistoicUsageArr = {
  cpuUsage: [number, number][];
  memoryUsage: [number, number][];
  gpuUsage: [number, number][];
};

export default function App() {
  const { usageData } = useUsageData();
  const { cpuData, memoryData, gpuData } = useSystemData();
  const [usageArr, setUsageArr] = useState<HistoicUsageArr>({
    cpuUsage: [[0, 0]],
    memoryUsage: [[0, 0]],
    gpuUsage: [[0, 0]],
  });

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
        const newGpuUsage: [number, number][] = [
          ...prev.gpuUsage,
          [prev.gpuUsage.length, usageData.gpu_usage.gpu_usage],
        ];

        return {
          cpuUsage: newCpuUsage.slice(-40),
          memoryUsage: newMemoryUsage.slice(-40),
          gpuUsage: newGpuUsage.slice(-40),
        };
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
          Used: {((usageArr.memoryUsage[usageArr.memoryUsage.length - 1][1] * memoryData.total_mem) / 100).toFixed(1)} /{" "}
          {memoryData.total_mem.toFixed(1)} Total
        </div>
        <div>Available Memory: {memoryData.available_mem}</div>
        <div>Swap: {memoryData.total_swap}</div>
        <div>
          <div>GPU Name: {gpuData.name}</div>
          <div>Driver Version: {gpuData.driver_version}</div>
          <div>Memory: {gpuData.total_memory}</div>
        </div>
        <h3>Usage: </h3>
      </div>
      <UsageGraph usageArr={usageArr.cpuUsage} plotHeight={200} plotWidth={200} />
      <UsageGraph usageArr={usageArr.memoryUsage} plotHeight={200} plotWidth={200} />
      <UsageGraph usageArr={usageArr.gpuUsage} plotHeight={200} plotWidth={200} />
    </div>
  );
}
