use crate::drivers::DroneDriver;
use anyhow::Context;
use async_trait::async_trait;
use mavlink::common::MavMessage;
use mavlink::MavConnection;
use std::sync::Mutex;

pub struct PixhawkDriver {
    pub connect: Option<Mutex<Box<dyn MavConnection<MavMessage> + Send>>>,

    pub port: String,
    pub baud_rate: u32,
    pub is_connected: bool,
}

#[async_trait]
impl DroneDriver for PixhawkDriver {
    async fn connect(&mut self, port: &str, baud_rate: u32) -> anyhow::Result<()> {
        println!("Connecting to port: {}", port);
        if self.is_connected {
            return Ok(());
        }

        let connection_string = format!("serial:{}:{}", port, baud_rate);
        let mav_connection = mavlink::connect::<MavMessage>(&connection_string)
            .with_context(|| format!("Mavlink Connect Error: {:?}", connection_string))?;


        self.connect = Some(Mutex::new(mav_connection));
        self.is_connected = true;
        self.port = port.to_string();
        self.baud_rate = baud_rate;
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

        println!("Disconnected to Pixhawk");
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
