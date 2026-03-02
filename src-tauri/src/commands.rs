use crate::core::{AppState, DroneManager};
use crate::drivers::esp32::Esp32Driver;
use crate::drivers::pixhawk::PixhawkDriver;
use crate::drivers::DroneDriver;
use crate::hardware::motor::{Motor, MotorPosition};
use crate::ultis::clear_connect_device;
use tauri::State;

// connect to device
#[tauri::command]
pub fn connect_device(
    port: String,
    baud_rate: u32,
    fc_type: String,
    state: State<'_, DroneManager>,
) -> Result<(), String> {
    let mut drone = state.driver.lock().unwrap();

    let mut driver: Box<dyn DroneDriver> = match fc_type.as_str() {
        "esp32" => Box::new(Esp32Driver {
            is_connected: false,
            port: port.clone(),
            baud_rate,
            connect: None,
        }),
        "pixhawk" => Box::new(PixhawkDriver {
            is_connected: false,
            port: port.clone(),
            baud_rate,
            connect: None,
        }),
        _ => return Err(format!("Unknown FcType: {}", fc_type)),
    };
    let _ = driver.connect(&port, baud_rate);

    *drone = Some(driver);

    Ok(())
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

#[tauri::command]
pub fn motor_test(state: State<'_, AppState>, id: MotorPosition, rate: u32) -> Result<(), String> {
    Motor::new(id).test(state, rate)
}
