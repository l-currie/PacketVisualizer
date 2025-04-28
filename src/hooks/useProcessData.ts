import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export interface ProcessInfo {
  pid: number;
  name: string;
  parent_id: number;
  memory_kb: number;
  cpu_usage: number;
  disk_read_bytes: number;
  disk_write_bytes: number;
}

const useProcessData = () => {
  const [rawProcessData, setRawProcessData] = useState<ProcessInfo[]>([]);

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const processes: ProcessInfo[] = await invoke("get_processes_info");
        setRawProcessData(processes.sort((a, b) => b.memory_kb - a.memory_kb));
      } catch (err) {
        console.error("Error fetching processes: ", err);
      }
    };

    fetchProcesses();
  }, []);

  return { processData: rawProcessData };
};

export default useProcessData;
