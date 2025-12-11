# Homelab Intelligence

A comprehensive monitoring and management system for your homelab infrastructure.

## Features

- Real-time system monitoring
- SSH-based remote management
- Alert system with push notifications
- AI-powered insights and recommendations
- Knowledge base for documentation
- Terminal access to homelab systems

## Prerequisites

- Docker and Docker Compose
- SSH access to your homelab systems
- (Optional) OpenAI or Anthropic API keys for AI features

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/mylaniakea/homelab-intelligence.git
cd homelab-intelligence
```

### 2. Set up SSH keys

Generate SSH keys for accessing your homelab systems:

```bash
cd backend/data
ssh-keygen -t rsa -b 4096 -f homelab_id_rsa -N ""
cd ../..
```

**Important:** Copy the public key (`homelab_id_rsa.pub`) to your homelab systems:

```bash
ssh-copy-id -i backend/data/homelab_id_rsa.pub user@your-homelab-host
```

### 3. Configure environment variables (optional)

```bash
cp .env.example .env
# Edit .env with your settings (API keys, etc.)
```

### 4. Start the application

```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Development Setup

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
homelab-intelligence/
├── backend/              # FastAPI backend
│   ├── app/             # Application code
│   │   ├── routers/     # API endpoints
│   │   ├── services/    # Business logic
│   │   └── models.py    # Database models
│   ├── data/            # Runtime data (not committed)
│   └── requirements.txt # Python dependencies
├── frontend/            # React + TypeScript frontend
│   ├── src/            # Source code
│   └── public/         # Static assets
├── docker-compose.yml  # Container orchestration
└── .env.example        # Environment template
```

## Security Notes

⚠️ **Never commit sensitive files:**
- SSH private keys (`*_rsa`, `*.pem`)
- Database files (`*.db`)
- Environment files (`.env`)
- API keys or passwords

All sensitive files are already in `.gitignore`, but always double-check before committing.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
