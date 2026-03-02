use crate::drivers::esp32::Esp32Driver;
use crate::drivers::pixhawk::PixhawkDriver;
use async_trait::async_trait;

pub mod esp32;
pub mod pixhawk;

/**
This module to provide connection to device
*/

#[async_trait]
pub trait DroneDriver: Send + Sync {
    async fn connect(&mut self, port: &str, baud: u32) -> anyhow::Result<()>;
    async fn disconnect(&mut self) -> anyhow::Result<()>;
    async fn test_connection(&self, accept_connect: Option<bool>) -> anyhow::Result<()>;

    fn is_connected(&self) -> bool;
}

pub struct DriverManager {
    pub driver: Option<Box<dyn DroneDriver>>,
}

impl DriverManager {
    pub fn new() -> Self {
        DriverManager { driver: None }
    }

    pub fn switch_driver(&mut self, driver_type: &str) {
        match driver_type {
            "esp32" => {
                self.driver = Some(Box::new(Esp32Driver {
                    connect: None,
                    baud_rate: 0,
                    is_connected: false,
                    port: String::new(),
                }))
            }
            "pixhawk" => {
                self.driver = Some(Box::new(PixhawkDriver {
                    connect: None,
                    baud_rate: 0,
                    is_connected: false,
                    port: String::new(),
                }))
            }
            _ => self.driver = None,
        }
    }
}
