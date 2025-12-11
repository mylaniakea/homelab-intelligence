# Homelab Intelligence - TODO List
*Last Updated: December 10, 2025 - Post-Claude Session*

## 🎯 Current Status
- **Phases Complete**: 1-5 ✅, Phase 7 ✅, Alert System Polish ✅
- **Active Development**: All immediate priorities complete! 🎉
- **Latest Feature**: Alert System Polish - 100% Complete
- **System Health**: All services operational, monitoring active
- **Backend Status**: All new endpoints working ✅
- **Frontend Status**: All features integrated and tested ✅

---

## 🔥 Completed Features

### 1. Alert System Polish ✅ COMPLETE (100%)
**Status**: All backend and frontend features fully implemented and tested
**Completion Date**: December 10, 2025
**Impact**: High user experience improvement achieved
**Test Report**: See TEST_REPORT_2025-12-10.md for full verification

#### Backend Infrastructure ✅ COMPLETE
- [x] Alert snooze endpoint (POST `/alerts/{id}/snooze`)
- [x] Bulk acknowledge endpoint (POST `/alerts/acknowledge-all`)
- [x] Bulk resolve endpoint (POST `/alerts/resolve-all`)
- [x] Push notification subscription backend
- [x] Notification logging system
- [x] Database migrations for all new features

#### Frontend Tasks ✅ COMPLETE
- [x] **Alert Sound Notifications**
  - [x] Backend: alert_sound_enabled setting in database
  - [x] Code: Sound playing logic in Alerts.tsx
  - [x] UI: Add toggle to Settings page (Settings.tsx:361-383)
  - [x] Integration: Connect Settings toggle to alert sound state

- [x] **Browser Push Notifications**
  - [x] Backend: VAPID keys, subscription endpoints
  - [x] Code: Service worker file created (public/service-worker.js)
  - [x] Registration: Register service worker in app (main.tsx:12-23)
  - [x] Permission: Request notification permission (Settings.tsx)
  - [x] Subscribe: Connect to `/push/subscribe` endpoint

- [x] **Alert Badge on Favicon**
  - [x] Backend: Alert stats endpoint
  - [x] Code: favicon.ts utility created
  - [x] Integration: Call updateFaviconBadge in Layout component
  - [x] Testing: Verified badge updates with alert counts

- [x] **Bulk Operations**
  - [x] Backend: Acknowledge-all and resolve-all endpoints
  - [x] Code: Buttons in Alerts.tsx (lines 174-206)
  - [x] Dialog: Create ConfirmDialogContext
  - [x] Integration: Add confirmation before bulk actions

- [x] **Alert Muting/Snooze**
  - [x] Backend: Snooze endpoint, snoozed_until column
  - [x] Backend: muted_until column for threshold rules
  - [x] UI: Add snooze dropdown with durations (Alerts.tsx:410-425)
  - [x] Display: Show "Snoozed until X" badge on alerts
  - [x] Maintenance Mode: maintenance_mode_until column added

### 2. Notification Channel Improvements ✅ COMPLETE
**Why**: Make notifications more reliable and debuggable
**Status**: All backend features implemented

- [x] **Better Error Handling**
  - Show detailed error messages on test failures
  - Validate configuration before saving
  - Connection testing for each channel type

- [x] **Notification Templates**
  - Customizable message templates per channel
  - Template variables: {server}, {metric}, {value}, {threshold}
  - Database column added (alert_channels.template)

- [x] **Delivery Status Tracking**
  - Track notification send attempts (notification_logs table)
  - Endpoint to view logs (GET `/alerts/notification-logs`)
  - Success/failure tracking per delivery

### 3. More Metrics to Monitor
**Why**: Expand monitoring coverage
**Effort**: Low (1 hour)

- [ ] **Add Metrics**:
  - Swap usage percentage
  - Load average (1, 5, 15 min)
  - Process count
  - Open file descriptors
  - Uptime

---

## 🔐 High Priority - Security Hardening

### 4. SSH Key Encryption at Rest
**Why**: Critical security improvement
**Effort**: Medium (3-4 hours)
**Requirements**: Python cryptography library (Fernet)

**Tasks**:
- [ ] Add cryptography to requirements.txt
- [ ] Create encryption service using Fernet
- [ ] Store encryption key in environment variable
- [ ] Encrypt existing keys (one-time migration)
- [ ] Update SSH service to decrypt keys on load
- [ ] Add key rotation functionality
- [ ] Document key management in README

**Implementation Notes**:
```python
from cryptography.fernet import Fernet
# Generate key: Fernet.generate_key()
# Store in: ENCRYPTION_KEY env variable
# Encrypt: fernet.encrypt(ssh_key.encode())
# Decrypt: fernet.decrypt(encrypted_key).decode()
```

### 5. Web UI Authentication
**Why**: Protect homelab dashboard from unauthorized access
**Effort**: High (6-8 hours)
**Stack**: JWT tokens, bcrypt for passwords

**Phase 1 - Basic Auth** (Required):
- [ ] Create User model (username, password_hash, created_at)
- [ ] Add users table to PostgreSQL
- [ ] Implement password hashing (bcrypt)
- [ ] Create /auth/login endpoint (returns JWT)
- [ ] Create /auth/logout endpoint
- [ ] JWT token generation and validation
- [ ] Protected route middleware

**Phase 2 - UI** (Required):
- [ ] Login page with form validation
- [ ] Store JWT in localStorage
- [ ] Add auth header to API client
- [ ] Redirect to login if 401
- [ ] Logout button in settings/header
- [ ] Show current user in UI

**Phase 3 - Enhanced** (Optional):
- [ ] User registration page
- [ ] Password reset flow (email)
- [ ] Refresh token rotation
- [ ] Session timeout settings
- [ ] Remember me functionality

---

## ⚡ Performance Optimizations

### 6. Frontend Bundle Size Reduction
**Why**: Currently 965KB - slow initial load
**Effort**: Medium (4-5 hours)
**Target**: Reduce to <500KB

**Tasks**:
- [ ] **Code Splitting**:
  - Split by route (React.lazy + Suspense)
  - Separate vendor chunks
  - Dynamic imports for heavy components

- [ ] **Lazy Loading**:
  ```tsx
  const Alerts = lazy(() => import('./pages/Alerts'));
  <Suspense fallback={<Loading />}>
    <Alerts />
  </Suspense>
  ```

- [ ] **Bundle Analysis**:
  - Run `npm run build -- --report`
  - Identify largest dependencies
  - Consider lighter alternatives

- [ ] **Tree Shaking**:
  - Ensure imports are tree-shakeable
  - Use named imports: `import { Bell } from 'lucide-react'`
  - Remove unused dependencies

### 7. API Response Caching
**Why**: Reduce backend load, faster UI updates
**Effort**: Medium (3-4 hours)
**Library**: React Query or SWR

**Benefits**:
- Automatic background refetching
- Optimistic updates
- Request deduplication
- Stale-while-revalidate

**Implementation**:
```tsx
// Example with React Query
const { data } = useQuery(['alerts'], fetchAlerts, {
  staleTime: 30000, // 30 seconds
  refetchInterval: 60000 // 1 minute
});
```

---

## 🎨 Dashboard Enhancements

### 8. Customizable Widgets
**Why**: Users want different views of their homelab
**Effort**: High (8-10 hours)
**Library**: react-grid-layout

**Features**:
- [ ] Drag-and-drop widget positioning
- [ ] Resize widgets
- [ ] Widget library (CPU chart, memory gauge, alert feed)
- [ ] Save custom layouts
- [ ] Dashboard templates (Minimal, Detailed, Admin)
- [ ] Import/export dashboard configs

### 9. Historical Data Visualization
**Why**: See trends over time, not just current values
**Effort**: Medium (4-5 hours)
**Library**: Chart.js or Recharts

**Charts**:
- [ ] CPU usage over time (last 24h, 7d, 30d)
- [ ] Memory usage trends
- [ ] Disk usage growth
- [ ] Network traffic patterns
- [ ] Alert frequency heatmap

**Data Source**: ServerSnapshot table (already collecting every 30min)

---

## 🔧 Server Management Improvements

### 10. Server Grouping & Tags
**Why**: Organize servers logically (Prod/Dev/Test)
**Effort**: Medium (3-4 hours)

**Database Changes**:
- [ ] Add tags column (JSONB array) to ServerProfile
- [ ] Add group column (optional string)

**UI Features**:
- [ ] Tag management UI
- [ ] Filter servers by tag/group
- [ ] Bulk operations on tagged servers
- [ ] Group-level threshold rules
- [ ] Tag-based color coding

### 11. Maintenance Mode
**Why**: Suppress alerts during planned maintenance
**Effort**: Low (2 hours)

**Features**:
- [ ] Enable maintenance mode per server
- [ ] Set maintenance window (start/end time)
- [ ] Suppress alerts during window
- [ ] Show maintenance badge in UI
- [ ] Log maintenance periods

---

## 🧠 Knowledge Base Enhancements

### 12. Full-Text Search
**Why**: Find knowledge items quickly
**Effort**: Medium (3 hours)
**Database**: PostgreSQL full-text search

**Implementation**:
```sql
-- Add tsvector column
ALTER TABLE knowledge ADD COLUMN search_vector tsvector;
-- Create index
CREATE INDEX knowledge_search_idx ON knowledge USING GIN(search_vector);
-- Update trigger for auto-update
```

**UI**:
- [ ] Search bar on Knowledge page
- [ ] Highlight search terms in results
- [ ] Filter by category + search

### 13. Markdown Editor
**Why**: Better content creation experience
**Effort**: Low (2 hours)
**Library**: react-markdown-editor-lite

**Features**:
- [ ] Live preview
- [ ] Syntax highlighting
- [ ] Image paste/upload
- [ ] Table support
- [ ] Code blocks with language

---

## 🚀 Advanced Features

### 14. Alert Escalation Policies
**Why**: Critical alerts need immediate attention
**Effort**: Medium (4 hours)

**Features**:
- [ ] Define escalation rules per threshold
- [ ] Escalate after X minutes unacknowledged
- [ ] Multi-level escalation (Team → Manager → On-call)
- [ ] Different channels per escalation level
- [ ] Escalation history

### 15. Automated Remediation
**Why**: Fix common issues automatically
**Effort**: High (8-10 hours)
**Risk**: High - needs safety controls

**Features**:
- [ ] Define remediation scripts per alert type
- [ ] Script templates (restart service, clear cache, etc.)
- [ ] Dry-run mode
- [ ] Manual approval for destructive actions
- [ ] Remediation history and rollback
- [ ] Success/failure tracking

**Safety**:
- [ ] Require confirmation
- [ ] Rate limiting (max N remediations per hour)
- [ ] Rollback on failure
- [ ] Audit log

### 16. Prometheus Integration
**Why**: Industry-standard metrics export
**Effort**: High (6-8 hours)

**Implementation**:
- [ ] Add prometheus_client to requirements.txt
- [ ] Create /metrics endpoint
- [ ] Export gauge metrics (CPU, memory, disk)
- [ ] Export counter metrics (alert count)
- [ ] Label metrics by server
- [ ] Documentation for Prometheus scrape config

---

## 📱 Mobile & PWA (Moonshot)

### 17. Progressive Web App
**Why**: Install on mobile home screen
**Effort**: Low (2-3 hours)

**Requirements**:
- [ ] Create manifest.json
- [ ] Add service worker for offline support
- [ ] Add install prompt
- [ ] Mobile-optimized CSS
- [ ] Touch gestures

### 18. Mobile UI Improvements
**Why**: Better mobile experience
**Effort**: Medium (4-5 hours)

**Tasks**:
- [ ] Responsive tables (horizontal scroll or cards)
- [ ] Touch-friendly buttons (larger tap targets)
- [ ] Mobile navigation (bottom tab bar?)
- [ ] Swipe gestures (dismiss alerts)
- [ ] Mobile keyboard optimization

---

## 🔗 External Integrations

### 19. Grafana Dashboard
**Why**: Powerful visualization tool
**Effort**: Medium (4 hours)

**Integration**:
- [ ] Prometheus exporter (see #16)
- [ ] Pre-built Grafana dashboard JSON
- [ ] Import instructions
- [ ] Sample queries

### 20. Ansible Integration
**Why**: Execute configuration management
**Effort**: High (8-10 hours)

**Features**:
- [ ] Store Ansible playbooks in database
- [ ] Execute playbook via API
- [ ] Playbook run history
- [ ] Output streaming (WebSocket)
- [ ] Inventory management

---

## 📊 Suggested Implementation Order (Next Session)

### Session 1: Alert Polish (2-3 hours)
1. Alert sound notifications
2. Browser push notifications
3. Bulk operations (acknowledge all, resolve all)
4. Alert badge on favicon

### Session 2: Security (4-5 hours)
1. SSH key encryption at rest
2. Basic web authentication (login/logout)

### Session 3: Performance (3-4 hours)
1. Code splitting and lazy loading
2. Bundle size optimization
3. API response caching

### Session 4: Dashboard (4-5 hours)
1. Historical data charts
2. Customizable widgets (basic)

### Session 5: Advanced Alerts (4-5 hours)
1. Alert escalation policies
2. More metrics (swap, load average)
3. Alert analytics dashboard

---

## 📝 Development Notes

**Testing Checklist** (before deploying):
- [ ] Run `docker-compose build` without errors
- [ ] Check backend logs for startup issues
- [ ] Verify all API endpoints return 200
- [ ] Test frontend in light and dark mode
- [ ] Check mobile responsiveness
- [ ] Test with real alert scenarios

**Performance Targets**:
- Bundle size: < 500KB (currently 965KB)
- Initial load: < 2s (currently ~4s)
- API response: < 100ms average
- Dashboard polling: User-configurable (currently working)

**Code Quality**:
- TypeScript strict mode
- ESLint + Prettier
- Component documentation
- API endpoint documentation (FastAPI auto-docs)

---

## 🎉 Development History

### Completed Dec 10 (Earlier - Gemini Agent)
- ✅ Alerts & Thresholds System (complete)
- ✅ 8 Notification channels (SMTP, Telegram, ntfy, Discord, Slack, Pushover, Gotify, Webhook)
- ✅ Threshold monitoring job (every 1 minute)
- ✅ Dynamic sidebar coloring
- ✅ Plugin-like channel configuration UI
- ✅ Alert acknowledgment and resolution workflow
- ✅ Background polling system (configurable intervals)
- ✅ Dark/light mode theme system
- ✅ UI polish (branding, icons)

**Lines of Code Added**: ~2,500
**New Database Tables**: 3 (ThresholdRule, Alert, AlertChannel)
**New API Endpoints**: 15+
**New Frontend Pages**: 2 (Thresholds, Alerts)

### Completed Dec 10 (Later - Claude Session)
**Context**: Picked up after Gemini ran out of tokens

#### Backend Fixes & Features ✅
- ✅ Fixed database migration issues (added missing columns)
- ✅ Fixed missing datetime import in schemas_settings.py
- ✅ Fixed circular import between push.py and push_notifications.py
- ✅ Rebuilt backend container (now running successfully)
- ✅ Alert snooze backend endpoint
- ✅ Bulk acknowledge/resolve backend endpoints
- ✅ Push notification subscription system (VAPID keys, endpoints)
- ✅ Notification logging infrastructure

#### Database Changes ✅
- ✅ `settings.polling_interval` (INTEGER)
- ✅ `settings.alert_sound_enabled` (BOOLEAN)
- ✅ `settings.maintenance_mode_until` (TIMESTAMP)
- ✅ `alerts.snoozed_until` (TIMESTAMP)
- ✅ `threshold_rules.muted_until` (TIMESTAMP)
- ✅ `alert_channels.template` (TEXT)
- ✅ New table: `push_subscriptions`
- ✅ New table: `notification_logs`

#### Issues Resolved ✅
1. Database columns not recognized → Manual SQL migration
2. Missing datetime import → Added to schemas_settings.py
3. Circular import deadlock → Moved VAPID constants to push_notifications.py
4. Stale container builds → Multiple no-cache rebuilds

**Session Duration**: ~45 minutes
**Issues Fixed**: 4 major
**Backend Endpoints Added**: 6
**Database Changes**: 8 (6 columns, 2 tables)
**Container Rebuilds**: 3

---

## 📋 Next Session Plan

### ✅ Alert System Polish - COMPLETED!
All immediate priority tasks have been completed successfully! See TEST_REPORT_2025-12-10.md for full verification.

### Recommended Next Steps (Choose One)

#### Option A: Security Hardening (High Priority) - 4-5 hours
1. **SSH Key Encryption at Rest** (3-4 hours)
   - Implement Fernet encryption for SSH keys
   - Store encryption key in environment variable
   - Migrate existing keys
   - Document key management

2. **Basic Web Authentication** (6-8 hours)
   - User model and JWT authentication
   - Login/logout endpoints
   - Protected routes
   - Login page UI

#### Option B: Performance Optimization - 3-4 hours
1. **Code Splitting & Lazy Loading**
   - Implement React.lazy() for route-based splitting
   - Reduce bundle size from 981KB to <500KB
   - Add loading states

2. **API Response Caching**
   - Implement React Query or SWR
   - Reduce redundant API calls
   - Optimize background polling

#### Option C: Dashboard Enhancements - 4-5 hours
1. **Historical Data Visualization**
   - CPU/Memory usage charts (last 24h, 7d, 30d)
   - Network traffic patterns
   - Alert frequency heatmap

2. **More Metrics to Monitor**
   - Swap usage percentage
   - Load average (1, 5, 15 min)
   - Process count
   - Open file descriptors

---

**System Status**: ✅ All immediate priorities complete! 🎉
**Ready for next phase of development!** 🚀
