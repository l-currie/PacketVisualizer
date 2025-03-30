mod cpu;
mod memory;
mod usage;

use cpu::get_cpu_info;
use memory::get_memory_info;
use std::env;
use usage::get_usage_data;

pub fn kb_to_gb(kb: u64) -> f64 {
    kb as f64 / (1024.0 * 1024.0 * 1024.0)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_cpu_info,
            get_memory_info,
            get_usage_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
