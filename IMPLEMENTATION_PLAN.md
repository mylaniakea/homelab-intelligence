# Homelab Intelligence Hub - Implementation Plan

## Completed Features

### Phase 1: Core Architecture (Complete)
- [x] Backend Structure: FastAPI app with standard service layer architecture.
- [x] Frontend Structure: React + Vite with Tailwind CSS.
- [x] Dockerization: Docker Compose setup for Backend (Python), Frontend (Nginx), and SQLite DB.
- [x] Basic UI Layout: Sidebar navigation and responsive layout.

### Phase 2: Server Profiles & SSH (Complete)
- [x] Database Models: `ServerProfile` table with JSON storage for hardware/OS info.
- [x] Profile Management: UI for adding, editing, and deleting server profiles.
- [x] SSH Connectivity:
    - [x] `asyncssh` integration for secure connections.
    - [x] Key-based auth setup helper (`setup-keys` endpoint).
    - [x] Remote telemetry fetching (OS, CPU, RAM, Disk).
- [x] Web Terminal: `xterm.js` + WebSocket bridge for real-time SSH access.

### Phase 3: Hardware Intelligence (Complete)
- [x] Deep Hardware Scan:
    - [x] PCI Devices (`lspci`) with noise filtering.
    - [x] Storage (`lsblk`, `/proc/mdstat`, `zpool`).
    - [x] Network Interfaces (`ip -j addr`).
    - [x] GPU Detection (NVIDIA + Generic PCI).
- [x] Hardware Visualization:
    - [x] Dedicated "Server Hardware" tab.
    - [x] Grouped Storage (NVMe, SSD, HDD, RAID).
    - [x] Stacked GPU cards.
    - [x] Localized timestamps for scan snapshots.

### Phase 4: AI & Knowledge Base (Complete)
- [x] Knowledge Base:
    - [x] Database model for storing insights.
    - [x] Manual entry interface ("Homelab" tab).
    - [x] Grouped view by Server/Category.
- [x] Intelligence Engine:
    - [x] Context-aware Chat (injects selected server's telemetry).
    - [x] System Report Generator (Auto-summaries).
    - [x] Hardware Ingestion: One-click "Add to Knowledge" converts raw hardware JSON to Markdown docs via AI.
- [x] Reporting:
    - [x] Save generated reports with collision handling (Overwrite vs New Version).
    - [x] Dashboard stats and recent activity feed.

## Upcoming / Remaining Tasks

### Phase 5: Refinement & Expansion (Next Steps)
- [x] **AI Orchestrator Refinement**: 
    - [x] Add support for OpenAI/Anthropic API keys in Settings.
    - [x] Make the "Active Model" selectable in UI.
- [ ] **Advanced Monitoring**:
    - [ ] Periodic background polling for server stats (currently on-demand).
    - [ ] Alerts/Thresholds (e.g., "CPU > 90%").
- [ ] **Security Hardening**:
    - [ ] Encrypt SSH keys at rest.
    - [ ] Add basic Auth (Login/Logout) for the web UI.

### Phase 6: Polish
- [ ] Mobile responsiveness tweaks for tables.
- [ ] Dark/Light mode toggle (currently hardcoded dark-ish theme components).

## Known Issues / Notes
- **Browser Cache**: Frontend changes to Tailwind classes sometimes require a hard refresh or cache clear if not seeing layout updates immediately.
- **SSH Keys**: The backend currently stores generated keys in `backend/data/`. Ensure this directory is persistent (it is volume-mounted).
- **ZFS/RAID**: Detection relies on standard commands (`zpool`, `mdstat`). Custom setups might need parser tweaks.
