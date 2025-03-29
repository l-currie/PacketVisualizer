import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export interface CpuData {
  name: string;
  brand: string;
  // cores: number;
  // threads: number;
  // temperature: number;
  usage: number;
  frequency: number;
}

const defaultCpuData: CpuData = {
  name: "Fetching CPU Data...",
  brand: "",
  usage: 0,
  frequency: 0,
};

const useCpuData = () => {
  const [cpuData, setCpuData] = useState<CpuData>(defaultCpuData);

  useEffect(() => {
    const fetchCpuData = async () => {
      try {
        const data: CpuData = await invoke("get_cpu_info");
        setCpuData(data);
      } catch (error) {
        console.error("Error fetching CPU data: ", error);
      }
    };

    fetchCpuData();
    const intervalId = setInterval(fetchCpuData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { cpuData };
};

export default useCpuData;
