use crate::core::config::{AppConfig, ConnectType};
use crate::core::AppState;
use crate::ultis::clear_connect_device;
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
    device.init_app(state)
}

// disconnect to device
#[tauri::command]
pub fn disconnect_device(state: State<'_, AppState>) -> Result<(), String> {
    let _ = clear_connect_device(state);

    println!("Disconnected device");
    Ok(())
}

#[tauri::command]
pub fn get_ports_available() -> Vec<String> {
    let ports = serialport::available_ports()
        .map_err(|e| e.to_string())
        .unwrap();
    ports.iter().map(|p| p.port_name.clone()).collect()
}
