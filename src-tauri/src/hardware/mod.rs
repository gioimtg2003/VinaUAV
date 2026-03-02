use anyhow::Result;
use async_trait::async_trait;
use serde::{Deserialize, Serialize};
pub mod motor;
mod protocol;

pub enum DriverType {
    Pixhawk,
    ESP32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TelemetryData {
    pub accel: [f32; 3],
    pub gyro: [f32; 3],
    pub mag: [f32; 3],

    pub altitude: [f32; 3],
}



#[async_trait]
pub trait SensorModule: Send + Sync {}
pub trait Hardware {
    fn read_stream(&self) -> Result<()>;
}
