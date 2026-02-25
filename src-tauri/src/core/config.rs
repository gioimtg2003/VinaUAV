use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ConnectType {
    Esp32,
    Stm32,
    Pixhawk
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppConfig {
    pub baud_rate: u32,
    
    pub port: String,
    
    pub connect_type: ConnectType,
}