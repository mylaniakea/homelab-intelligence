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
- [x] Plugin System:
    - [x] 17 data collection plugins (lm-sensors, smartctl, nvidia-smi, etc.).
    - [x] Plugin detection and installation via SSH.
    - [x] Per-server plugin enable/disable.
    - [x] Plugin categories and metadata.
- [x] Snapshot Service:
    - [x] APScheduler-based periodic snapshots (every 30 minutes).
    - [x] Stores comprehensive server state over time.

## Upcoming / Remaining Tasks

### Phase 5: Refinement & Expansion (Complete)
- [x] **AI Orchestrator Refinement**:
    - [x] Add support for OpenAI/Anthropic API keys in Settings.
    - [x] Make the "Active Model" selectable in UI.
- [x] **Advanced Monitoring & Alerting**:
    - [x] Configurable background polling for Dashboard stats (15s to 12h intervals).
    - [x] Polling interval settings in Automations tab.
    - [x] **Alerts/Thresholds System** (Complete):
        - [x] Threshold rules for 8 metric types (CPU, Memory, Disk, I/O, Network, Temperature).
        - [x] Three severity levels (Info, Warning, Critical).
        - [x] Per-server or global rules.
        - [x] Alert creation, acknowledgment, and resolution.
        - [x] Alert history tracking.
        - [x] Dynamic sidebar coloring (red/yellow/blue/green).
    - [x] **Notification Channels** (8 integrations):
        - [x] SMTP (Email) with TLS support.
        - [x] Telegram Bot API.
        - [x] ntfy (self-hosted or ntfy.sh).
        - [x] Discord webhooks.
        - [x] Slack webhooks.
        - [x] Pushover mobile push.
        - [x] Gotify self-hosted push.
        - [x] Generic webhook (custom endpoints).
    - [x] **Automated Monitoring**:
        - [x] Threshold checking job (every 1 minute).
        - [x] Alert deduplication (5-minute cooldown).
        - [x] Multi-channel notification delivery.

### Phase 6: Security Hardening (Pending)
- [ ] **SSH Key Encryption at Rest**:
    - [ ] Add encryption layer for stored SSH keys.
    - [ ] Key management UI.
- [ ] **Web UI Authentication**:
    - [ ] User model and JWT tokens.
    - [ ] Login/logout pages.
    - [ ] Protected routes and session management.

### Phase 7: Polish (Complete)
- [x] Dark/Light mode toggle with theme persistence and system preference detection.
- [x] App branding standardized to "Homelab Intelligence" (two-line layout).
- [x] Icon consistency (Reports icon aligned across Dashboard and sidebar).

## Recent Updates (Session: Dec 10, 2025)

### ✅ Data Recovery & System Restoration
- Fixed Docker containers running stale code by rebuilding images
- Migrated data from SQLite to PostgreSQL (1 server profile + settings)
- Added missing database columns (`enabled_plugins`, `detected_plugins`)
- Restored all project functionality from Dec 9 snapshot

### ✅ UI/UX Improvements
- **Dark/Light Mode**: Complete theme system with localStorage persistence and system preference detection
- **Branding**: Standardized app name to "Homelab Intelligence" with two-line layout
- **Icon Consistency**: Fixed Reports icon mismatch between Dashboard and sidebar

### ✅ Background Polling System
- Added configurable polling intervals (15s to 12h) in Automations tab
- Dashboard automatically refreshes at user-defined intervals
- Settings persist to database and apply without page refresh

### ✅ Alerts & Thresholds System (COMPLETE)
**Database Models:**
- ThresholdRule table: Define monitoring thresholds with conditions
- Alert table: Track triggered alerts with acknowledgment/resolution workflow
- AlertChannel table: Configure notification channels with JSONB configs

**Backend Infrastructure:**
- Threshold monitoring service with metric extraction from snapshots
- Notification service supporting 8 channel types
- APScheduler job running every 1 minute for threshold checks
- Alert deduplication (5-minute cooldown per rule/server)
- REST API endpoints: /thresholds/, /alerts/, /alerts/channels/

**Frontend Pages:**
- **Thresholds page** (/thresholds): CRUD interface for threshold rules
  - 8 metric types: CPU, Memory, Disk, I/O, Network, Temperature
  - Per-server or all-servers targeting
  - Visual severity indicators (info/warning/critical)
- **Alerts page** (/alerts): Plugin-like UI for alerts and channels
  - Active alerts tab with acknowledge/resolve actions
  - Notification channels tab with card-based setup
  - Real-time statistics (critical/warning/info counts)
  - Test notification functionality
- **Dynamic Sidebar**: Alerts tab color changes based on severity
  - 🔴 Red = Critical alerts
  - 🟡 Yellow = Warnings
  - 🔵 Blue = Info only
  - 🟢 Green = All clear

**Notification Channels (8 Integrations):**
1. SMTP: Full email support with TLS
2. Telegram: Bot API with Markdown formatting
3. ntfy: Push notifications (self-hosted or cloud)
4. Discord: Rich embeds via webhooks
5. Slack: Attachments via webhooks
6. Pushover: Priority-based mobile push
7. Gotify: Self-hosted push server
8. Generic Webhook: Custom HTTP endpoints

**Monitoring Features:**
- Automated threshold checking (every 1 minute)
- Metrics extracted from snapshot data
- Condition evaluation (greater_than, less_than, equal_to)
- Multi-channel notification delivery
- Alert spam prevention with cooldown logic

## Next Priority Tasks

### Immediate (Quick Wins)
1. **Alert System Enhancements**
   - [ ] Add more metric types (Swap usage, Load average, Process count)
   - [ ] Alert escalation policies (auto-escalate after X minutes)
   - [ ] Bulk operations (acknowledge all, resolve all)
   - [ ] Alert muting/snooze functionality
   - [ ] Alert analytics dashboard (trends, frequency)

2. **Notification Improvements**
   - [ ] Rich notification templates with customizable messages
   - [ ] Notification rate limiting (prevent spam)
   - [ ] Channel testing improvements (show actual error messages)
   - [ ] Notification delivery status tracking

3. **UI/UX Polish**
   - [ ] Alert sound notifications (browser audio)
   - [ ] Browser push notifications (Web Push API)
   - [ ] Alert badge on favicon
   - [ ] Keyboard shortcuts for common actions
   - [ ] Bulk threshold rule import/export

### High Priority
4. **SSH Key Encryption at Rest**
   - [ ] Implement Fernet symmetric encryption for SSH keys
   - [ ] Encryption key management (env variable or key file)
   - [ ] Automatic migration of existing keys
   - [ ] Key rotation support

5. **Web UI Authentication**
   - [ ] User model with password hashing (bcrypt)
   - [ ] JWT token generation and validation
   - [ ] Login/logout pages with form validation
   - [ ] Protected routes and middleware
   - [ ] Session management and refresh tokens
   - [ ] Password reset flow

6. **Performance Optimizations**
   - [ ] Code splitting for large bundle size (currently 965KB)
   - [ ] Lazy loading for routes (React.lazy + Suspense)
   - [ ] API response caching (React Query or SWR)
   - [ ] Memoization for expensive computations
   - [ ] Virtual scrolling for large lists

### Medium Priority
7. **Dashboard Enhancements**
   - [ ] Customizable dashboard widgets (drag-and-drop)
   - [ ] Dashboard templates (Overview, Detailed, Minimal)
   - [ ] Multi-server comparison view
   - [ ] Historical data charts (CPU/Memory trends)
   - [ ] Quick actions panel

8. **Server Management**
   - [ ] Server grouping and tags (Production, Dev, Testing)
   - [ ] Bulk operations on multiple servers
   - [ ] Server health score calculation
   - [ ] Maintenance mode (suppress alerts)
   - [ ] Server dependencies mapping

9. **Knowledge Base Improvements**
   - [ ] Full-text search across knowledge items
   - [ ] Markdown editor with preview
   - [ ] File attachments (images, PDFs)
   - [ ] Knowledge item versioning
   - [ ] Export to external wiki (Confluence, Notion)

### Advanced Features
10. **Advanced Threshold Rules**
    - [ ] Complex conditions with AND/OR logic
    - [ ] Time-based rules (weekday vs weekend thresholds)
    - [ ] Derived metrics (e.g., CPU trend over 5 minutes)
    - [ ] Composite alerts (multiple conditions)

11. **Automated Remediation**
    - [ ] Define remediation scripts per alert type
    - [ ] Auto-execute safe remediation (restart service)
    - [ ] Manual approval for destructive actions
    - [ ] Remediation history and rollback

12. **External Integrations**
    - [ ] Prometheus metrics exporter
    - [ ] Grafana dashboard integration
    - [ ] Ansible playbook execution
    - [ ] Terraform state monitoring
    - [ ] Docker/K8s container monitoring

## Moonshot Ideas 🚀
*Future enhancements and experimental features to explore later*

### Mobile & Cross-Platform
- [ ] Mobile responsiveness tweaks for tables
- [ ] Progressive Web App (PWA) support
- [ ] Mobile-optimized dashboard view
- [ ] Touch-friendly controls and gestures
- [ ] Native mobile app (React Native?)

### Future Enhancements
- [ ] Multi-user support with role-based access
- [ ] Server grouping and tagging
- [ ] Custom dashboard widgets
- [ ] Plugin marketplace
- [ ] Automated remediation actions
- [ ] Integration with monitoring tools (Prometheus, Grafana)
- [ ] Ansible playbook execution
- [ ] Container orchestration monitoring (K8s, Docker Swarm)

## Known Issues / Notes
- **Browser Cache**: Frontend changes to Tailwind classes sometimes require a hard refresh or cache clear if not seeing layout updates immediately.
- **SSH Keys**: The backend currently stores generated keys in `backend/data/`. Ensure this directory is persistent (it is volume-mounted).
- **ZFS/RAID**: Detection relies on standard commands (`zpool`, `mdstat`). Custom setups might need parser tweaks.
