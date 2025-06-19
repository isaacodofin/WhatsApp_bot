// Bot configuration
const config = {
    // Bot information
    BOT_NAME: process.env.BOT_NAME || 'WhatsApp Bot',
    BOT_VERSION: '1.0.0',
    
    // Server configuration for uptime monitoring
    SERVER_PORT: process.env.PORT || 5000,
    UPTIME_ENDPOINT: process.env.UPTIME_ENDPOINT || '/status',
    
    // Session configuration
    SESSION_FOLDER: 'auth_info_baileys',
    
    // Logging configuration
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    
    // Auto-response settings
    AUTO_RESPONSE_ENABLED: process.env.AUTO_RESPONSE_ENABLED === 'true' || false,
    
    // Command prefix
    COMMAND_PREFIX: ['.', '!'],
    
    // Reconnection settings
    RECONNECT_DELAY: 3000, // 3 seconds
    MAX_RECONNECT_ATTEMPTS: -1, // Infinite attempts (-1)
    
    // Rate limiting (messages per minute)
    RATE_LIMIT: 30,
    
    // Environment
    NODE_ENV: process.env.NODE_ENV || 'production'
};

module.exports = config;
