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

export interface GpuInfo {
  name: string;
  driver_version: string;
  total_memory: number;
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

const defaultGpuInfo: GpuInfo = {
  name: "Fetching GPU Data...",
  driver_version: "0",
  total_memory: 0,
};

const useSystemData = () => {
  const [cpuData, setCpuData] = useState<CpuData>(defaultCpuData);
  const [memoryData, setMemoryData] = useState<MemoryInfo>(defaultMemoryInfo);
  const [gpuData, setGpuData] = useState<GpuInfo>(defaultGpuInfo);

  useEffect(() => {
    const fetchSysData = async () => {
      try {
        const cpuInfo: CpuData = await invoke("get_cpu_info");
        const memoryInfo: MemoryInfo = await invoke("get_memory_info");
        const gpuInfo: GpuInfo = await invoke("get_gpu_info");
        setCpuData(cpuInfo);
        setMemoryData(memoryInfo);
        setGpuData(gpuInfo);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchSysData();
  }, []);

  return { cpuData, memoryData, gpuData };
};

export default useSystemData;
