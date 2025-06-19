const express = require('express');
const config = require('./config/config');
const logger = require('./utils/logger');

// Import bot status functions
const botModule = require('./bot');

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint for uptime monitoring
app.get(config.UPTIME_ENDPOINT, (req, res) => {
    const isConnected = botModule.getConnectionStatus();
    const uptime = botModule.getUptime();
    const startTime = botModule.getStartTime();
    
    const status = {
        status: isConnected ? 'online' : 'offline',
        uptime: Math.floor(uptime / 1000), // uptime in seconds
        uptimeFormatted: formatUptime(uptime),
        startTime: startTime.toISOString(),
        timestamp: new Date().toISOString(),
        version: config.BOT_VERSION,
        service: 'WhatsApp Bot'
    };
    
    const httpStatus = isConnected ? 200 : 503;
    res.status(httpStatus).json(status);
    
    logger.info(`Status check - Bot ${isConnected ? 'online' : 'offline'}, Uptime: ${status.uptimeFormatted}`);
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'WhatsApp Bot is running',
        version: config.BOT_VERSION,
        endpoints: {
            status: config.UPTIME_ENDPOINT
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        availableEndpoints: ['/', config.UPTIME_ENDPOINT]
    });
});

// Error handler
app.use((error, req, res, next) => {
    logger.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

function formatUptime(uptime) {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days}d ${hours % 24}h ${minutes % 60}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

// Start server
const server = app.listen(config.SERVER_PORT, '0.0.0.0', () => {
    logger.success(`🌐 HTTP server started on port ${config.SERVER_PORT}`);
    logger.info(`📊 Status endpoint: http://localhost:${config.SERVER_PORT}${config.UPTIME_ENDPOINT}`);
    logger.info('🔗 Ready for UptimeRobot monitoring');
});

// Handle server shutdown
process.on('SIGTERM', () => {
    logger.info('🛑 Shutting down HTTP server...');
    server.close(() => {
        logger.info('✅ HTTP server closed');
    });
});

module.exports = app;
