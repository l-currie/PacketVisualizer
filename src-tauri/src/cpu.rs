use serde::{Deserialize, Serialize};
use sysinfo::{CpuRefreshKind, RefreshKind, System};

#[derive(Serialize, Deserialize)]
pub struct CpuInfo {
    usage: f32,
    name: String,
    vendor_id: String,
    brand: String,
    frequency: u64,
}

#[tauri::command]
pub async fn get_cpu_info() -> CpuInfo {
    let result = tokio::task::spawn_blocking(|| {
        let mut sys =
            System::new_with_specifics(RefreshKind::new().with_cpu(CpuRefreshKind::everything()));

        let cpus = sys.cpus();
        let name = cpus[0].name().to_string();
        let vendor_id = cpus[0].vendor_id().to_string();
        let brand = cpus[0].brand().to_string();
        let frequency = cpus[0].frequency();

        //Need to wait because CPU is based on diff so need to refresh?
        std::thread::sleep(sysinfo::MINIMUM_CPU_UPDATE_INTERVAL);
        sys.refresh_cpu_usage();
        let average_usage =
            sys.cpus().iter().map(|cpu| cpu.cpu_usage()).sum::<f32>() / sys.cpus().len() as f32;

        CpuInfo {
            usage: average_usage,
            name: name,
            vendor_id: vendor_id,
            brand: brand,
            frequency: frequency,
        }
    })
    .await
    .unwrap();

    result
}
