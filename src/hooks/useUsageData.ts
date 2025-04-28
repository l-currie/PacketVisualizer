import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export interface CpuUsage {
  average_cpu_usage: number;
  cpu_usage_arr: number[];
}

export interface MemoryUsage {
  used_mem: number;
  // free_mem: number;
  used_swap: number;
  // free_swap: number;
}

export interface GpuUsage {
  gpu_usage: number;
  gpu_memory_usage: number;
  gpu_temp: number;
}

export interface UsageData {
  memory_usage: MemoryUsage;
  cpu_usage: CpuUsage;
  gpu_usage: GpuUsage;
}

export interface HistoricUsageArr {
  cpuUsage: [number, number][];
  memoryUsage: [number, number][];
  gpuUsage: [number, number][];
}

const defaultUsageData: UsageData = {
  memory_usage: {
    used_mem: 0,
    // free_mem: 0,
    used_swap: 0,
    // free_swap: 0,
  },
  cpu_usage: {
    average_cpu_usage: 0,
    cpu_usage_arr: [0],
  },
  gpu_usage: {
    gpu_usage: 0,
    gpu_memory_usage: 0,
    gpu_temp: 0,
  },
};

const useUsageData = () => {
  const [usageArr, setUsageArr] = useState<HistoricUsageArr>({
    cpuUsage: [[0, 0]],
    memoryUsage: [[0, 0]],
    gpuUsage: [[0, 0]],
  });

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const data: UsageData = await invoke("get_usage_data");

        setUsageArr((prev) => {
          const newCpuUsage: [number, number][] = [
            ...prev.cpuUsage,
            [prev.cpuUsage.length, data.cpu_usage.average_cpu_usage],
          ];
          const newMemoryUsage: [number, number][] = [
            ...prev.memoryUsage,
            [prev.memoryUsage.length, data.memory_usage.used_mem],
          ];
          const newGpuUsage: [number, number][] = [...prev.gpuUsage, [prev.gpuUsage.length, data.gpu_usage.gpu_usage]];

          return {
            cpuUsage: newCpuUsage.slice(-40),
            memoryUsage: newMemoryUsage.slice(-40),
            gpuUsage: newGpuUsage.slice(-40),
          };
        });
      } catch (error) {
        console.error("Error fetching usage data: ", error);
      }
    };

    fetchUsageData();
    const intervalId = setInterval(fetchUsageData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { usageArr };
};

export default useUsageData;
