import React, { useEffect, useState } from "react";
import UsageGraph from "../components/UsageGraph";
import { CpuInfo, MemoryInfo, GpuInfo } from "../hooks/useSystemData";
import { HistoricUsageArr } from "../hooks/useUsageData";

interface PerformanceScreenProps {
  cpuData: CpuInfo;
  memoryData: MemoryInfo;
  gpuData: GpuInfo;
  usageArr: HistoricUsageArr;
}

function PerformanceScreen({ cpuData, memoryData, gpuData, usageArr }: PerformanceScreenProps) {
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

export default PerformanceScreen;
