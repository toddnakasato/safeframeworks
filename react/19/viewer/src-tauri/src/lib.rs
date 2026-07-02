#[cfg_attr(mobile, tauri::mobile_entry_point)]

use std::path::PathBuf;
use tauri::Emitter;
use notify::{Watcher, RecursiveMode, Event, EventKind};

#[tauri::command]
fn read_file_content(path: String) -> Result<String, String> {
    let cwd = std::env::current_dir().unwrap_or_default();
    let p = cwd.join(&path);
    std::fs::read_to_string(&p).map_err(|e| e.to_string())
}

#[tauri::command]
fn write_state(path: String, content: String) -> Result<(), String> {
    let cwd = std::env::current_dir().unwrap_or_default();
    let p = cwd.join(&path);
    std::fs::write(&p, &content).map_err(|e| e.to_string())
}

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
        .env("SAFEZERO_ROOT", "/Users/toddnakasato/Documents/FF/VSCODE/FFPROD/safeconfig")
        .output()
        .map_err(|e| format!("spawn {}: {}", name, e))?;
    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}

/// Start watching a directory for file changes.
/// Emits "fs-change" events to the frontend with the changed file path.
#[tauri::command]
fn watch_dir(app: tauri::AppHandle, path: String) -> Result<(), String> {
    let watch_path = PathBuf::from(&path);
    if !watch_path.exists() {
        return Err(format!("Path does not exist: {}", path));
    }

    std::thread::spawn(move || {
        let (tx, rx) = std::sync::mpsc::channel();
        let mut watcher = notify::recommended_watcher(move |res: Result<Event, notify::Error>| {
            if let Ok(event) = res {
                let _ = tx.send(event);
            }
        }).expect("Failed to create watcher");
        watcher.watch(&watch_path, RecursiveMode::Recursive).expect("Failed to watch path");

        // Debounce: collect events for 50ms before emitting
        let debounce = std::time::Duration::from_millis(50);
        loop {
            if let Ok(event) = rx.recv() {
                // Collect any additional events within debounce window
                std::thread::sleep(debounce);
                while rx.try_recv().is_ok() {}

                // Only emit for data file changes
                let dominated = match event.kind {
                    EventKind::Create(_) | EventKind::Modify(_) | EventKind::Remove(_) => true,
                    _ => false,
                };
                if !dominated { continue; }

                for path in &event.paths {
                    let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("");
                    let fname = path.file_name().and_then(|f| f.to_str()).unwrap_or("");

                    // Only watch known file formats
                    if !matches!(ext, "json" | "ndjson" | "csv" | "parquet" | "arrow") { continue; }
                    // Exclude runtime diagnostics
                    if matches!(fname, "render.json" | "boot.json" | "dispatch.json") { continue; }

                    let _ = app.emit("fs-change", path.to_string_lossy().to_string());
                }
            }
        }
    });

    Ok(())
}

#[tauri::command]
fn list_dir(path: String) -> Result<Vec<String>, String> {
    let cwd = std::env::current_dir().unwrap_or_default();
    let p = cwd.join(&path);
    if !p.exists() { return Ok(vec![]); }
    let entries = std::fs::read_dir(&p).map_err(|e| e.to_string())?;
    let mut names: Vec<String> = vec![];
    for entry in entries {
        if let Ok(e) = entry {
            if let Some(name) = e.file_name().to_str() {
                names.push(name.to_string());
            }
        }
    }
    names.sort();
    Ok(names)
}

#[tauri::command]
fn ensure_dir(path: String) -> Result<(), String> {
    let cwd = std::env::current_dir().unwrap_or_default();
    let p = cwd.join(&path);
    std::fs::create_dir_all(&p).map_err(|e| e.to_string())
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
    .invoke_handler(tauri::generate_handler![safecli_run, read_file_content, write_state, watch_dir, list_dir, ensure_dir])
        .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
