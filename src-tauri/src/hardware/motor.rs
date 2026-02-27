use crate::commands::connect_device;
use crate::core::{AppState, DroneLink};
use crate::ultis::{is_serial_connect, send_serial_raw};
use mavlink::common::MavMessage;
use mavlink::MavHeader;
use tauri::State;

pub enum MotorPosition {
    Motor1,
    Motor2,
    Motor3,
    Motor4,
}
impl MotorPosition {
    fn as_str(&self) -> &'static str {
        match self {
            Self::Motor1 => "motor1",
            Self::Motor2 => "motor2",
            Self::Motor3 => "motor3",
            Self::Motor4 => "motor4",
        }
    }
    fn as_idx(&self) -> usize {
        match self {
            Self::Motor1 => 1,
            Self::Motor2 => 2,
            Self::Motor3 => 3,
            Self::Motor4 => 4,
        }
    }

    fn resolve_id(&self, is_serial_connect: bool) -> &str {
        if is_serial_connect {
            match self {
                Self::Motor1 => "motor1test",
                Self::Motor2 => "motor2test",
                Self::Motor3 => "motor3test",
                Self::Motor4 => "motor4test",
            }
        } else {
            self.as_str()
        }
    }
}
pub struct Motor {
    name: String,

    id: MotorPosition,
}

impl Motor {
    pub fn new(name: String, id: MotorPosition) -> Motor {
        Motor { name, id }
    }
    pub fn name(&self) -> &str {
        &self.name
    }
    pub fn id(&self) -> &str {
        &self.id.as_str()
    }

    pub fn test(&self, state: State<'_, AppState>, id: String, rate: u32) -> Result<(), String> {
        if (rate > 100) {
            return Err("Capacity is too large!".to_string());
        }

        // tips: drop config variable to clear memory
        let is_serial = {
            let config = state.config.lock().unwrap();
            is_serial_connect(&state.config)
        };

        if is_serial {
            let raw = {
                let current_id = self.id.resolve_id(false);
                format!("{}::{}", current_id, 1000 + (rate * 10))
            };

            send_serial_raw(&state, raw)
        } else {
            let mut lock = state.conn.lock().unwrap();

            match lock.as_mut() {
                Some(DroneLink::Pixhawk(conn)) => {
                    let header = MavHeader {
                        system_id: 255,
                        component_id: 0,
                        sequence: 0,
                    };

                    let msg = MavMessage::COMMAND_LONG(mavlink::common::COMMAND_LONG_DATA {
                        param1: self.id.as_idx() as f32,
                        param2: 0.0,
                        param3: rate as f32,
                        param4: 2.0,
                        target_system: 1,
                        target_component: 1,
                        command: mavlink::common::MavCmd::MAV_CMD_DO_MOTOR_TEST,
                        ..Default::default()
                    });

                    let _ = conn
                        .send(&header, &msg)
                        .map_err(|e| format!("MAVLink Send Error: {}", e));

                    Ok(())
                }
                Some(DroneLink::ESP32(_)) => {
                    let raw = {
                        let current_id = self.id.resolve_id(false);
                        format!("{}::{}", current_id, 1000 + (rate * 10))
                    };

                    send_serial_raw(&state, raw)
                }
                None => Err("No active connection found!".to_string()),
            }
        }
    }
}
