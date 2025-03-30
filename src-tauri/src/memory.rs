use serde::{Deserialize, Serialize};
use sysinfo::System;

use crate::kb_to_gb;

#[derive(Serialize, Deserialize)]
pub struct MemoryInfo {
    total_mem: f64,
    available_mem: f64,
    total_swap: f64,
}

#[tauri::command]
pub async fn get_memory_info() -> MemoryInfo {
    let result = tokio::task::spawn_blocking(|| {
        let mut sys = System::new_all();
        sys.refresh_memory();

        MemoryInfo {
            total_mem: kb_to_gb(sys.total_memory()),
            available_mem: kb_to_gb(sys.available_memory()),
            total_swap: kb_to_gb(sys.total_swap()),
        }
    })
    .await
    .unwrap();

    result
}
