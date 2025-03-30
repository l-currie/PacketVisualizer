import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export interface CpuData {
  name: string;
  brand: string;
  // cores: number;
  // threads: number;
  // temperature: number;
  frequency: number;
}

export interface MemoryInfo {
  total_mem: number;
  available_mem: number;
  total_swap: number;
}

const defaultCpuData: CpuData = {
  name: "Fetching CPU Data...",
  brand: "",
  frequency: 0,
};

const defaultMemoryInfo: MemoryInfo = {
  total_mem: 0,
  available_mem: 0,
  total_swap: 0,
};

const useSystemData = () => {
  const [cpuData, setCpuData] = useState<CpuData>(defaultCpuData);
  const [memoryInfo, setMemoryInfo] = useState<MemoryInfo>(defaultMemoryInfo);

  useEffect(() => {
    const fetchSysData = async () => {
      try {
        const cpuData: CpuData = await invoke("get_cpu_info");
        const memoryInfo: MemoryInfo = await invoke("get_memory_info");
        setCpuData(cpuData);
        setMemoryInfo(memoryInfo);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchSysData();
  }, []);

  return { cpuData, memoryInfo };
};

export default useSystemData;
