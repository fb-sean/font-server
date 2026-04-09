# Font Server

A simple font server for serving fonts to the web. This server acts as a proxy for Google Fonts and other font sources, allowing you to host fonts on your own domain.

## Features

- Serve fonts from your own domain
- Storage backend integration (Hetzner Storage Box, etc.)
- Easy configuration via environment variables
- Docker support for easy deployment
- Search endpoint for font discovery

## Quick Start with Docker

### 1. Create Environment File

Create a `.env` file in the same directory as your `docker-compose.yml`:

```bash
# Server Configuration
PORT=3000
URL=https://fonts.yourdomain.com

# Storage Configuration
STORAGE_URL=https://your-storagebox.de
STORAGE_PATH=/fonts/
STORAGE_USER=your-username
STORAGE_PASSWORD=your-password
```

### 2. Start the Server

```bash
docker-compose up -d
```

The server will start on the configured port (default: 3000).

### 3. Verify Installation

```bash
curl http://localhost:3000/ping
```

You should receive a pong response.

## Docker Compose Example

```yaml
version: '3.8'

services:
  font-server:
    image: fb-sean/font-server:latest
    container_name: font-server
    restart: unless-stopped

    environment:
      # Server Configuration
      - PORT=3000
      - URL=https://fonts.yourdomain.com

      # Storage Configuration
      - STORAGE_URL=https://your-storagebox.de
      - STORAGE_PATH=/fonts/
      - STORAGE_USER=your-username
      - STORAGE_PASSWORD=your-password

    ports:
      - "3000:3000"

    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/ping"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `URL` | The base URL for your font server | `https://fonts.example.com` |
| `STORAGE_URL` | Your storage service URL | `https://storagebox.example.com` |
| `STORAGE_USER` | Storage authentication username | `user123` |
| `STORAGE_PASSWORD` | Storage authentication password | `securepassword` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | The port the server listens on | `3000` |
| `STORAGE_PATH` | The path where fonts are stored | `/fonts/` |

## Manual Installation

### Prerequisites

- Node.js 22 or higher
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/fb-sean/font-server.git
cd font-server
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment file:
```bash
cp .env.example .env
```

4. Edit `.env` with your configuration:
```bash
nano .env
```

5. Build the project:
```bash
npm run build
```

6. Start the server:
```bash
npm start
```

## API Endpoints

### Health Check

```
GET /ping
```

Pong!

### Font Files

```
GET /s/{font-path}
```

Retrieve specific font files.

### CSS Endpoint

```
GET /css?family={font-family}
```

Get CSS for embedding fonts.

## Development

### Development Mode

```bash
npm run dev
```

This will:
- Compile TypeScript in watch mode
- Restart the server automatically on changes

### Build

```bash
npm run build
```

### Production Start

```bash
npm start
```

## Docker Image Usage

### Pull the Image

```bash
docker pull fb-sean/font-server:latest
```

### Run with Docker CLI

```bash
docker run -d \
  --name font-server \
  -p 3000:3000 \
  -e PORT=3000 \
  -e URL=https://fonts.example.com \
  -e STORAGE_URL=https://storagebox.example.com \
  -e STORAGE_PATH=/fonts/ \
  -e STORAGE_USER=user123 \
  -e STORAGE_PASSWORD=password \
  fb-sean/font-server:latest
```

### Run with Custom .env File

```bash
docker run -d \
  --name font-server \
  -p 3000:3000 \
  --env-file .env \
  fb-sean/font-server:latest
```

## Building Locally

```bash
docker build -t font-server .
docker run -p 3000:3000 --env-file .env font-server
```

## Deployment

### Using GitHub Actions

This project includes a GitHub Actions workflow that automatically builds and publishes Docker images to Docker Hub when you push to the main branch or create version tags.

To enable automatic publishing:

1. Fork this repository
2. Add `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets to your repository settings
3. Push to your fork or create version tags

### Manual Deployment

1. Build the Docker image:
```bash
docker build -t your-username/font-server:latest .
```

2. Push to Docker Hub:
```bash
docker login
docker push your-username/font-server:latest
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

Sean Sattler <sean@sattler.dev>

## Repository

https://github.com/fb-sean/font-server
