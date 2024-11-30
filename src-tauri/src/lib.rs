use tauri::Manager;
// use window_vibrancy::*;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_title("").unwrap();
            window
                .set_title_bar_style(tauri::TitleBarStyle::Transparent)
                .unwrap();

            // #[cfg(target_os = "macos")]
            // apply_vibrancy(
            //     &window,
            //     NSVisualEffectMaterial::UltraDark,
            //     Some(NSVisualEffectState::Active),
            //     Some(8.0),
            // )
            // .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
            //
            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}