# VinaUAV ✈️

![Tauri](https://img.shields.io/badge/Tauri-2.x-24C8DB?logo=tauri&logoColor=white) ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![Rust](https://img.shields.io/badge/Rust-Edition%202021-000000?logo=rust&logoColor=white)

VinaUAV is a cross-platform desktop application (Windows, macOS, Linux) for managing UAV missions, communicating with ESP32 flight controllers over serial, and visualizing telemetry in real time. Built with Tauri (Rust backend) and React + TailwindCSS (frontend), it combines native performance, low memory footprint, and a modern UI.

---

## Why this app? 🤔

- 🚁 **Purpose-built for UAV ops**: Mission planning, RC inputs, PID tuning, and sensor calibration in one tool.
- ⚡ **Fast & lightweight**: Tauri keeps binaries small and startup fast while giving direct hardware access.
- 🛰️ **Field-ready**: Serial integration with ESP32 for live telemetry, motor tests, and health monitoring.
- 🎨 **Customizable**: Theme system and modular UI to adapt to different missions and operator preferences.

---

## Key features 🧰

- 🔌 Serial communication with ESP32 (command/telemetry channel)
- 📈 Real-time data visualization (IMU, motors, battery, GPS)
- 🗺️ Mission planning UI (routes, waypoints, profiles)
- 🎛️ PID tuning and motor testing workflows
- 🧭 Sensor calibration helpers (IMU, RC input, compass)
- 🌗 Customizable themes (palette tokens for operator profiles)

---

## Architecture overview 🏗️

```
Frontend (React + TailwindCSS + Vite)
  ├─ Routing, layout, UI components (3D drone viz, telemetry cards)
  ├─ Zustand/store for session state
  └─ Calls Tauri commands for device/FS/OS access

Tauri Core (Rust)
  ├─ Serial layer (ESP32 communication, framing, parsing)
  ├─ Command handlers exposed to frontend
  └─ Plugin surface (opener, future: logging, settings)

ESP32 (flight controller / firmware)
  ├─ Sends telemetry frames (IMU, motors, battery, GPS)
  └─ Receives commands (arming, motor test, mission upload)
```

---

## Tech stack 🛠️

- **App shell**: Tauri 2.x (Rust, secure IPC, plugin system)
- **UI**: React 19, TailwindCSS 4, Radix primitives, Lucide icons
- **3D & visualization**: React Three Fiber, Drei, Three.js
- **State**: Zustand
- **Tooling**: Vite, TypeScript, ESLint, Prettier

---

## Project structure (high level) 🗂️

```
VinaUAV/
├─ src/             # React frontend
├─ src-tauri/       # Rust backend (Tauri)
├─ public/          # Static assets
└─ dist/            # Frontend build output
```

---

## Prerequisites 📦

- Node.js ≥ 18 and pnpm (project uses `pnpm@9`)
- Rust toolchain (stable) with `cargo`
- Tauri CLI (`cargo install tauri-cli` or use `pnpm tauri`)
- Platform-specific deps:
  - **Windows**: VS Build Tools, WebView2
  - **macOS**: Xcode Command Line Tools
  - **Linux**: `libgtk-3-dev`, `libayatana-appindicator3-dev`, `webkit2gtk-4.1`

---

## Development setup 🚧

Install JS deps:

```/dev/null/commands.sh#L1-3
pnpm install
```

Install Rust deps (handled by `cargo` on demand). If you need the Tauri CLI:

```/dev/null/commands.sh#L5-6
cargo install tauri-cli
```

Run the app in dev (frontend + Tauri):

```/dev/null/commands.sh#L8-9
pnpm tauri dev
```

Lint & format:

```/dev/null/commands.sh#L11-13
pnpm lint:fix
pnpm prettier:fix
```

---

## Build instructions 🏭

Create a production build (frontend + Tauri bundle):

```/dev/null/commands.sh#L15-16
pnpm tauri build
```

Frontend-only bundle (for previewing UI):

```/dev/null/commands.sh#L18-19
pnpm build
```

Artifacts will be in `src-tauri/target/release` (platform-specific executables and installers).

---

## Serial communication notes 🔄

- Ensure the ESP32 is connected and the correct COM/tty device is selected.
- On Linux/macOS, you may need to add your user to the dialout/uucp group or set appropriate udev rules.
- The Rust backend owns the serial port; the React UI calls Tauri commands to send/receive frames.
- Future enhancement: configurable baud rate and protocol framing.

---

## Theming 🎨

- Palette tokens live in `src/constants/palellte.constant.ts`.
- You can extend the record to add more themes and surface them in the UI for operator presets.

---

## Scripts (package.json) 📜

- `pnpm tauri dev` — run app with live reload
- `pnpm tauri build` — build native binaries
- `pnpm build` — frontend production build
- `pnpm lint:fix` — lint with autofix
- `pnpm prettier:fix` — format sources

---

## Roadmap ideas 🧭

- Mission file import/export (common formats)
- Offline map caching and geofencing overlays
- Advanced telemetry logging and playback
- OTA firmware update flow for ESP32
- Safety interlocks (battery health, geofence breach alerts)

---

## License ⚖️

Proprietary (adjust as needed for your distribution model).