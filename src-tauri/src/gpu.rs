use nvml_wrapper::Nvml;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct GpuInfo {
    name: String,
    driver_version: String,
    total_memory: u64,
}

#[tauri::command]
pub async fn get_gpu_info() -> GpuInfo {
    let result = tokio::task::spawn_blocking(|| {
        let nvml = Nvml::init().expect("Failed to initialize Nvml");
        let device = nvml.device_by_index(0).expect("Failed to get device");

        let name = device.name().unwrap();
        let driver_version = nvml.sys_driver_version().unwrap();
        let total_memory = device.memory_info().unwrap().total / (1024 * 1024 * 1024);

        GpuInfo {
            name,
            driver_version,
            total_memory,
        }
    })
    .await
    .unwrap();

    result
}
