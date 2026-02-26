use crate::core::config::{AppConfig, ConnectType};
use crate::core::{AppState, DroneLink};
use std::io::Write;
use std::sync::{Arc, Mutex};
use tauri::State;

pub fn clear_connect_device(state: State<'_, AppState>) -> Result<(), String> {
    let mut lock = state.conn.lock().unwrap();
    *lock = None;
    Ok(())
}

pub fn send_serial_raw(state: State<'_, AppState>, text: String) -> Result<(), String> {
    if is_serial_connect(&state.config) {
        let mut lock = state
            .conn
            .lock()
            .map_err(|_| "Failed to lock connection".to_string())?;

        if let Some(conn) = lock.as_mut() {
            match conn {
                DroneLink::ESP32(port) => {
                    let msg = format!("{}\n", text);
                    port.write_all(msg.as_bytes())
                        .map_err(|_| "Failed to write to port".to_string())?;
                }

                DroneLink::Pixhawk(_) => {
                    println!("Not support for Pixhawk");
                }
            }
        }

        return Ok(());
    }

    Err("Not implemented".to_string())
}

pub fn is_serial_connect(app_config: &Arc<Mutex<AppConfig>>) -> bool {
    matches!(app_config.lock().unwrap().connect_type, ConnectType::Esp32)
}
