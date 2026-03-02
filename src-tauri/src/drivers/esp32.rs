use crate::drivers::DroneDriver;
use anyhow::Context;
use async_trait::async_trait;
use serialport::SerialPort;
use std::sync::Mutex;
use std::time::Duration;

pub struct Esp32Driver {
    pub connect: Option<Mutex<Box<dyn SerialPort + Send>>>,

    pub port: String,
    pub baud_rate: u32,
    pub is_connected: bool,
}

#[async_trait]
impl DroneDriver for Esp32Driver {
    async fn connect(&mut self, port: &str, baud_rate: u32) -> anyhow::Result<()> {
        if self.is_connected {
            return Ok(());
        }

        let mut port_builder = serialport::new(port, baud_rate)
            .timeout(Duration::from_millis(1000))
            .open()
            .with_context(|| format!("Failed to open port: {:?}", port))?;

        port_builder
            .write_data_terminal_ready(false)
            .expect("TODO: panic message");
        port_builder
            .write_request_to_send(false)
            .expect("TODO: panic message");

        self.connect = Some(Mutex::new(port_builder));
        self.port = port.to_string();
        self.baud_rate = baud_rate;
        self.is_connected = true;

        println!("Connected to serial port");
        Ok(())
    }
    async fn disconnect(&mut self) -> anyhow::Result<()> {
        if !self.is_connected {
            return Ok(());
        }

        self.connect = None;
        self.is_connected = false;
        self.baud_rate = 0;
        self.port = String::new();

        println!("Disconnected from serial port");
        Ok(())
    }
    async fn test_connection(&self, _accept_connect: Option<bool>) -> anyhow::Result<()> {
        if !self.is_connected {
            return Err(anyhow::anyhow!("Drone chưa được kết nối"));
        }
        Ok(())
    }

    fn is_connected(&self) -> bool {
        self.is_connected
    }
}
