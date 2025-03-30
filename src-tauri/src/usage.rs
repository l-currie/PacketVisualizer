use nvml_wrapper::Nvml;
use serde::{Deserialize, Serialize};
use sysinfo::{CpuRefreshKind, RefreshKind, System};

use crate::kb_to_gb;

#[derive(Serialize, Deserialize)]
pub struct MemoryUsage {
    used_mem: f64,
    // free_mem: f64,
    used_swap: f64,
    // free_swap: f64,
}

#[derive(Serialize, Deserialize)]
pub struct CpuUsage {
    average_cpu_usage: f32,
    cpu_usage_arr: Vec<f32>,
}

#[derive(Serialize, Deserialize)]
pub struct GpuUsage {
    gpu_usage: u32,
    gpu_memory_usage: u32,
    gpu_temp: u32,
}

#[derive(Serialize, Deserialize)]
pub struct UsageData {
    memory_usage: MemoryUsage,
    cpu_usage: CpuUsage,
    gpu_usage: GpuUsage,
}

async fn get_memory_usage() -> Result<MemoryUsage, String> {
    let result = tokio::task::spawn_blocking(|| {
        let mut sys = System::new_all();
        sys.refresh_memory();

        let total_mem = kb_to_gb(sys.total_memory());
        let total_swap = kb_to_gb(sys.total_swap());

        MemoryUsage {
            used_mem: kb_to_gb(sys.used_memory()) / total_mem * 100.0,
            // free_mem: kb_to_gb(sys.free_memory()),
            used_swap: kb_to_gb(sys.used_swap()) / total_swap * 100.0,
            // free_swap: kb_to_gb(sys.free_swap()),
        }
    })
    .await
    .map_err(|e| format!("Failed to spawn blocking task: {}", e))?; // Handle task spawn errors

    Ok(result)
}

async fn get_cpu_usage() -> Result<CpuUsage, String> {
    let result = tokio::task::spawn_blocking(|| {
        let mut sys =
            System::new_with_specifics(RefreshKind::new().with_cpu(CpuRefreshKind::everything()));

        // Wait because CPU usage is based on diff, so we need to refresh
        std::thread::sleep(sysinfo::MINIMUM_CPU_UPDATE_INTERVAL);

        // Refresh CPU usage data
        sys.refresh_cpu_usage();

        let cpu_usage_arr: Vec<f32> = sys.cpus().iter().map(|cpu| cpu.cpu_usage()).collect();
        let average_usage = cpu_usage_arr.iter().sum::<f32>() / sys.cpus().len() as f32;

        CpuUsage {
            average_cpu_usage: average_usage,
            cpu_usage_arr: cpu_usage_arr,
        }
    })
    .await
    .map_err(|e| format!("Failed to spawn blocking task: {}", e))?; // Handle task spawn errors

    Ok(result)
}

async fn get_gpu_usage() -> Result<GpuUsage, String> {
    let result = tokio::task::spawn_blocking(|| {
        let nvml = Nvml::init().expect("Failed to initialize NVML");
        let device = nvml.device_by_index(0).expect("Failed to get device");

        let utilization = device
            .utilization_rates()
            .expect("Failed to get utilization");
        let temp = device
            .temperature(nvml_wrapper::enum_wrappers::device::TemperatureSensor::Gpu)
            .expect("Failed to get temperature");

        GpuUsage {
            gpu_usage: utilization.gpu,
            gpu_memory_usage: utilization.memory,
            gpu_temp: temp,
        }
    })
    .await
    .expect("Failed");

    Ok(result)
}

#[tauri::command]
pub async fn get_usage_data() -> Result<UsageData, String> {
    // Handle the result of get_cpu_usage and get_memory_usage
    let cpu_usage = get_cpu_usage()
        .await
        .map_err(|e| format!("Failed to get CPU usage: {}", e))?;
    let memory_usage = get_memory_usage()
        .await
        .map_err(|e| format!("Failed to get memory usage: {}", e))?;
    let gpu_usage = get_gpu_usage()
        .await
        .map_err(|e| format!("Failed to get memory usage: {}", e))?;

    Ok(UsageData {
        cpu_usage,
        memory_usage,
        gpu_usage,
    })
}
