import { useEffect, useState } from "react";
import useCpuData from "./hooks/useCpuData";
import CpuUsageGraph from "./components/CpuUsageGraph";

export default function App() {
  const { cpuData } = useCpuData();
  const [cpuUsageArr, setCpuUsageArr] = useState<[number, number][]>([[0, 0]]);

  useEffect(() => {
    if (cpuData) {
      setCpuUsageArr((prev) => {
        const newData: [number, number][] = [...prev, [prev.length, cpuData.usage]];
        return newData.slice(-20);
      });
    }
  }, [cpuData]);

  return (
    <div className="container">
      <div className="cpuContainer">
        <div>{cpuData.brand}</div>
        <div>{cpuData.name}</div>
        <div>{cpuData.frequency}</div>
        <div>{cpuData.usage}</div>
        <h3>Usage: </h3>
      </div>
      <CpuUsageGraph cpuUsageArr={cpuUsageArr} />
    </div>
  );
}
