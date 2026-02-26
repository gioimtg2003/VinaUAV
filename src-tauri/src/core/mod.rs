pub mod config;

use crate::core::config::{AppConfig, ConnectType};
use mavlink::{common::MavMessage, MavConnection};
use serialport::SerialPort;
use std::sync::{Arc, Mutex};
use std::thread::sleep;
use std::time::Duration;
use tauri::State;

pub enum DroneLink {
    Pixhawk(Box<dyn MavConnection<MavMessage> + Send>),
    ESP32(Box<dyn SerialPort>),
}

// App Vina UAV state
pub struct AppState {
    pub conn: Arc<Mutex<Option<DroneLink>>>,
    pub config: Arc<Mutex<AppConfig>>,
    is_connected: Arc<Mutex<bool>>,
}

impl AppState {
    pub fn new(config: AppConfig) -> Self {
        Self {
            conn: Arc::new(Mutex::new(None)),
            config: Arc::new(Mutex::new(config)),
            is_connected: Arc::new(Mutex::new(false)),
        }
    }

    pub fn init_app(&self, state: State<'_, AppState>) -> Result<(), String> {
        let mut lock = state.conn.lock().unwrap();
        let mut connected = self.is_connected.lock().unwrap();
        let config = self.config.lock().unwrap();

        if lock.is_none() || *connected  {
            *lock = None;
            *connected = false;
            sleep(Duration::from_millis(100));

            println!("Relase existing connection");
        }

        let _ = match config.connect_type {
            ConnectType::Esp32 => {
                let port_builder = serialport::new(&config.port, config.baud_rate)
                    .timeout(Duration::from_millis(1000));

                match port_builder.open() {
                    Ok(mut serial_port) => {
                        serial_port.write_data_terminal_ready(false).ok();
                        serial_port.write_request_to_send(false).ok();

                        *lock = Some(DroneLink::ESP32(serial_port));
                        println!("Connected to serial port");
                        Ok(())
                    }
                    Err(e) => Err(format!("Error: {:?}", e)),
                }
            }
            ConnectType::Stm32 => Ok(()),
            ConnectType::Pixhawk => {
                let connection_string = format!("serial:{}:{}", config.port, config.baud_rate);
                let mav_connection = mavlink::connect::<MavMessage>(&connection_string)
                    .map_err(|e| format!("Mavlink Connect Error: {:?}", e))?;

                *lock = Some(DroneLink::Pixhawk(mav_connection));
                *self.is_connected.lock().unwrap() = true;

                Ok(())
            }
        };

        *state.config.lock().unwrap() = config.clone();
        Ok(())
    }
}
