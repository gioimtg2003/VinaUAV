// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use std::collections::HashMap;
use tauri::menu::MenuBuilder;
use tauri::AppHandle;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

const links: [(&str, &str, &str); 5] = [
    (
        "open-social-netlify",
        "Netlify",
        "https://app.netlify.com/teams/christopherbiscardi/overview",
    ),
    (
        "open-social-youtube",
        "YouTube",
        "https://www.youtube.com/@chrisbiscardi",
    ),
    ("open-social-twitter", "Twitter", "https://twitter.com/"),
    // github links
    (
        "open-github-rust-adventure",
        "Rust Adventure",
        "https://github.com/rust-adventure",
    ),
    (
        "open-github-bevy",
        "Bevy",
        "https://github.com/bevyengine/bevy",
    ),
];

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // remove menu item for windows
            #[cfg(target_os = "windows")]
            {
                use tauri::menu::Menu;
                if let Ok(empty_menu) = MenuBuilder::new(app.handle()).build() {
                    let _ = app.handle().set_menu(empty_menu);
                }
            }
            let menu = MenuBuilder::new(app)
                .text("open", "Open")
                .text("close", "Close")
                .check("check_item", "Check Item")
                .separator()
                .text("disabled_item", "Disabled Item")
                .text("status", "Status: Processing...")
                .fullscreen()
                .build()?;

            app.set_menu(menu.clone())?;

            // Update individual menu item text
            menu.get("status")
                .unwrap()
                .as_menuitem_unchecked()
                .set_text("Status: Ready")?;

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
