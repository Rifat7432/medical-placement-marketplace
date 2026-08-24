# CI/CD Setup Guide

This project now includes a complete CI/CD pipeline with Docker containerization.

## Local Development

### Using Docker Compose

```bash
# Start services (app + MongoDB)
docker compose up --build

# Stop services
docker compose down

# View logs
docker compose logs -f app
```

The app will be available at `http://localhost:5000`

### Environment Variables

Create a `.env` file in the root directory:

```
NODE_ENV=development
MONGODB_URI=mongodb://admin:password@mongodb:27017/ai-navigation?authSource=admin
PORT=5000
```

## Building Docker Image Locally

```bash
# Build the image
docker build -t ai-navigation-backend:latest .

# Run the container
docker run -p 5000:5000 \
  --env-file .env \
  ai-navigation-backend:latest
```

## GitHub Actions CI/CD Pipeline

The pipeline runs on every push and PR to `main` and `develop` branches.

### Pipeline Stages

1. **Lint & Test** - Runs on all PRs and pushes
   - Installs dependencies
   - Runs ESLint
   - Checks Prettier formatting
   - Builds TypeScript

2. **Build & Push** - Runs on pushes only (not PRs)
   - Builds Docker image using Buildx
   - Pushes to Docker Hub
   - Tags with branch, git SHA, and semantic versions
   - Uses layer caching for faster builds

3. **Security Scan** - Runs after build
   - Scans image with Trivy for vulnerabilities
   - Reports findings to GitHub Security

### Required Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub personal access token |

### Generating Docker Hub Credentials

1. Go to https://hub.docker.com/settings/security
2. Create a new Personal Access Token
3. Copy the token and add it as `DOCKER_PASSWORD`

## Docker Hub Repository

After setting up secrets, images will be pushed to:
```
docker.io/{DOCKER_USERNAME}/ai-navigation-backend:latest
```

Pull and run:
```bash
docker pull {DOCKER_USERNAME}/ai-navigation-backend:latest
docker run -p 5000:5000 --env-file .env {DOCKER_USERNAME}/ai-navigation-backend:latest
```

## Production Deployment

### Using Docker Compose

```bash
# Deploy with environment-specific settings
docker compose -f docker-compose.yml up -d

# View logs
docker compose logs -f app

# Restart service
docker compose restart app
```

### Using Docker Run

```bash
docker run -d \
  --name ai-navigation \
  -p 5000:5000 \
  --env-file .env \
  --restart unless-stopped \
  {DOCKER_USERNAME}/ai-navigation-backend:latest
```

## Monitoring & Logs

```bash
# View container logs
docker logs -f ai-navigation-backend

# Check container health
docker ps -a | grep ai-navigation

# Inspect container
docker inspect ai-navigation-backend
```
