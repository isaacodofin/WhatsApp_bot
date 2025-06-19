const logger = require('../utils/logger');
const config = require('../config/config');

// Available commands
const commands = {
    ping: {
        description: 'Check if bot is responding',
        usage: 'ping or .ping'
    },
    alive: {
        description: 'Check bot status and uptime',
        usage: '.alive'
    },
    menu: {
        description: 'Show available commands',
        usage: '.menu'
    }
};

async function handleCommand(sock, from, messageContent, message, startTime) {
    const command = messageContent.toLowerCase().replace(/^[.!]/, '');
    
    try {
        switch (command) {
            case 'ping':
                await handlePing(sock, from);
                break;
                
            case 'alive':
                await handleAlive(sock, from, startTime);
                break;
                
            case 'menu':
            case 'help':
                await handleMenu(sock, from);
                break;
                
            default:
                logger.warn(`❓ Unknown command: ${command}`);
                break;
        }
    } catch (error) {
        logger.error('❌ Error handling command:', error);
        await sendMessage(sock, from, '❌ Sorry, there was an error processing your command.');
    }
}

async function handlePing(sock, from) {
    const startTime = Date.now();
    await sendMessage(sock, from, '🏓 Pong!');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    logger.info(`🏓 Ping command executed - Response time: ${responseTime}ms`);
}

async function handleAlive(sock, from, botStartTime) {
    const uptime = Date.now() - botStartTime;
    const uptimeString = formatUptime(uptime);
    
    const aliveMessage = `🤖 *Bot Status Report*\n\n` +
        `✅ Status: Online & Active\n` +
        `⏰ Uptime: ${uptimeString}\n` +
        `🚀 Started: ${botStartTime.toLocaleString()}\n` +
        `📱 WhatsApp: Connected\n` +
        `💚 Health: Good\n\n` +
        `_Bot is running smoothly and ready to serve!_`;
    
    await sendMessage(sock, from, aliveMessage);
    logger.info('📊 Alive status sent');
}

async function handleMenu(sock, from) {
    let menuMessage = `🤖 *WhatsApp Bot - Command Menu*\n\n`;
    menuMessage += `📋 *Available Commands:*\n\n`;
    
    Object.entries(commands).forEach(([cmd, info]) => {
        menuMessage += `🔸 *${info.usage}*\n`;
        menuMessage += `   ${info.description}\n\n`;
    });
    
    menuMessage += `💡 *Usage Tips:*\n`;
    menuMessage += `• Commands can start with . or !\n`;
    menuMessage += `• 'ping' works without prefix\n`;
    menuMessage += `• Bot responds to both private and group messages\n\n`;
    menuMessage += `_Bot Version: ${config.BOT_VERSION}_`;
    
    await sendMessage(sock, from, menuMessage);
    logger.info('📋 Menu sent');
}

async function sendMessage(sock, to, message) {
    try {
        await sock.sendMessage(to, { text: message });
        logger.info(`📤 Message sent to ${to}`);
    } catch (error) {
        logger.error('❌ Failed to send message:', error);
        throw error;
    }
}

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

module.exports = {
    handleCommand,
    commands
};
