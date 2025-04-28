use std::os::windows::process;

use serde::{Deserialize, Serialize};
use sysinfo::System;

#[derive(Serialize, Deserialize)]
pub struct ProcessInfo {
    name: String,
    pid: u32,
    parent_id: Option<u32>,
    memory_kb: u64,
    cpu_usage: f32,
    disk_read_bytes: u64,
    disk_write_bytes: u64,
}

#[tauri::command]
pub async fn get_processes_info() -> Result<Vec<ProcessInfo>, String> {
    let result = tokio::task::spawn_blocking(|| {
        let mut sys = System::new_all();

        sys.refresh_processes(sysinfo::ProcessesToUpdate::All, true);

        let processes: Vec<ProcessInfo> = sys
            .processes()
            .iter()
            .map(|(pid, process)| ProcessInfo {
                name: process
                    .name()
                    .to_str()
                    .unwrap_or("invalid_utf8")
                    .to_string(),

                pid: pid.as_u32(),
                parent_id: process.parent().map(|p| p.as_u32()),
                memory_kb: process.memory() / 1024,
                cpu_usage: process.cpu_usage(),
                disk_read_bytes: process.disk_usage().total_read_bytes,
                disk_write_bytes: process.disk_usage().total_written_bytes,
            })
            .collect();
        processes
    })
    .await
    .map_err(|e| format!("Failed to spawn blocking task: {}", e))?; // Handle task spawn errors

    Ok(result)
}
