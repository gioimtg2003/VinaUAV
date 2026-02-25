use crate::core::config::{AppConfig, ConnectType};
use crate::core::AppState;
use tauri::State;

// connect to device
#[tauri::command]
pub fn connect_device(
    port: String,
    baud: u32,
    connect_type: ConnectType,
    state: State<'_, AppState>,
) -> Result<(), String> {

    let device = AppState::new(AppConfig {
        connect_type,
        baud_rate: baud,
        port,
    });
    device.connect_device(state)
}
// disconnect to device

