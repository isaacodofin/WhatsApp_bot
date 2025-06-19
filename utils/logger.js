const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Log file path
const logFile = path.join(logsDir, `bot-${new Date().toISOString().split('T')[0]}.log`);

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

function getTimestamp() {
    return new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

function writeToFile(level, message) {
    const logEntry = `[${getTimestamp()}] [${level}] ${message}\n`;
    try {
        fs.appendFileSync(logFile, logEntry, 'utf8');
    } catch (error) {
        console.error('Failed to write to log file:', error);
    }
}

function info(message) {
    const timestamp = getTimestamp();
    const formattedMessage = `${colors.cyan}[${timestamp}] [INFO]${colors.reset} ${message}`;
    console.log(formattedMessage);
    writeToFile('INFO', message);
}

function success(message) {
    const timestamp = getTimestamp();
    const formattedMessage = `${colors.green}[${timestamp}] [SUCCESS]${colors.reset} ${message}`;
    console.log(formattedMessage);
    writeToFile('SUCCESS', message);
}

function error(message, error = null) {
    const timestamp = getTimestamp();
    const errorDetails = error ? ` - ${error.message || error}` : '';
    const fullMessage = `${message}${errorDetails}`;
    const formattedMessage = `${colors.red}[${timestamp}] [ERROR]${colors.reset} ${fullMessage}`;
    console.error(formattedMessage);
    writeToFile('ERROR', fullMessage);
}

function warn(message) {
    const timestamp = getTimestamp();
    const formattedMessage = `${colors.yellow}[${timestamp}] [WARN]${colors.reset} ${message}`;
    console.warn(formattedMessage);
    writeToFile('WARN', message);
}

function message(content) {
    const timestamp = getTimestamp();
    const formattedMessage = `${colors.magenta}[${timestamp}] [MESSAGE]${colors.reset} ${content}`;
    console.log(formattedMessage);
    writeToFile('MESSAGE', content);
}

function debug(message) {
    const timestamp = getTimestamp();
    const formattedMessage = `${colors.blue}[${timestamp}] [DEBUG]${colors.reset} ${message}`;
    console.log(formattedMessage);
    writeToFile('DEBUG', message);
}

module.exports = {
    info,
    success,
    error,
    warn,
    message,
    debug
};
