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

export interface UsageData {
  memory_usage: MemoryUsage;
  cpu_usage: CpuUsage;
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
};

const useUsageData = () => {
  const [usageData, setUsageData] = useState<UsageData>(defaultUsageData);

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const data: UsageData = await invoke("get_usage_data");
        setUsageData(data);
      } catch (error) {
        console.error("Error fetching usage data: ", error);
      }
    };

    fetchUsageData();
    const intervalId = setInterval(fetchUsageData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { usageData };
};

export default useUsageData;
