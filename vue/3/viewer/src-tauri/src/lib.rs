#[cfg_attr(mobile, tauri::mobile_entry_point)]

#[tauri::command]
fn safecli_run(name: String, args: Vec<String>) -> Result<String, String> {
    let home = dirs::home_dir().unwrap_or_default();
    let bin = home.join(".local/bin").join(&name);
    if !bin.exists() {
        return Err(format!("{} not found at {}", name, bin.display()));
    }
    let cwd = std::env::current_dir().unwrap_or_default();
    let output = std::process::Command::new(&bin)
        .args(&args)
        .current_dir(&cwd)
        .output()
        .map_err(|e| format!("spawn {}: {}", name, e))?;
    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}

pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![safecli_run])
        .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
