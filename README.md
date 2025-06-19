# WhatsApp Bot

A Node.js WhatsApp bot built with Baileys library for automated messaging and command handling.

## Features

- QR code authentication
- Command handling (.ping, .alive, .menu)
- Express server for monitoring
- Session persistence
- Logging system
- UptimeRobot compatible

## Quick Start

```bash
# Install dependencies
npm install

# Start the bot
npm start
```

## Commands

- `ping` - Test bot responsiveness
- `.alive` - Check bot status and uptime
- `.menu` - Show available commands

## Deployment

### VPS Deployment
```bash
# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

### Docker Deployment
```bash
docker build -t whatsapp-bot .
docker run -d -p 5000:5000 whatsapp-bot
```

## Monitoring

- Status endpoint: `http://localhost:5000/status`
- Health checks for UptimeRobot integration
- Detailed logging in `/logs` directory

## Configuration

Edit `config/config.js` for customization:
- Bot name and version
- Server port
- Command prefixes
- Reconnection settings

## File Structure

```
├── bot.js              # Main WhatsApp connection logic
├── server.js           # Express server for monitoring
├── commands/
│   └── handlers.js     # Command processing
├── config/
│   └── config.js       # Configuration settings
├── utils/
│   └── logger.js       # Logging system
├── auth_info_baileys/  # WhatsApp session storage
└── logs/               # Application logs
```

## Requirements

- Node.js 18+
- Internet connection
- WhatsApp account for QR scanning

## License

MIT License
