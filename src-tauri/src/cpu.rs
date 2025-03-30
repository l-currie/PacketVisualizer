use serde::{Deserialize, Serialize};
use sysinfo::{CpuRefreshKind, RefreshKind, System};

#[derive(Serialize, Deserialize)]
pub struct CpuInfo {
    name: String,
    brand: String,
    frequency: u64,
}

#[tauri::command]
pub async fn get_cpu_info() -> CpuInfo {
    let result = tokio::task::spawn_blocking(|| {
        let mut sys =
            System::new_with_specifics(RefreshKind::new().with_cpu(CpuRefreshKind::everything()));

        sys.refresh_cpu_all();

        let cpus = sys.cpus();
        let cpu_zero = &cpus[0];
        let name = cpu_zero.name().to_string();
        let brand = cpu_zero.brand().to_string();
        let frequency = cpu_zero.frequency();

        CpuInfo {
            name: name,
            brand: brand,
            frequency: frequency,
        }
    })
    .await
    .unwrap();

    result
}
