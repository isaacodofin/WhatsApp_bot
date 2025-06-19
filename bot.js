const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const P = require('pino');
const { handleCommand } = require('./commands/handlers');
const logger = require('./utils/logger');
const config = require('./config/config');

let sock;
let qrDinamic;
let isConnected = false;
let startTime = new Date();

async function connectToWhatsApp() {
    try {
        // Get latest Baileys version
        const { version } = await fetchLatestBaileysVersion();
        
        // Use multi-file auth state for session persistence
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
        
        // Create WhatsApp socket connection with proper logger
        sock = makeWASocket({
            version,
            printQRInTerminal: false,
            auth: state,
            defaultQueryTimeoutMs: 60000,
            browser: ['WhatsApp Bot', 'Chrome', '10.15.7'],
            logger: P({ level: 'fatal' }),
            generateHighQualityLinkPreview: true
        });

        // Handle connection updates
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (qr) {
                qrDinamic = qr;
                logger.info('Scan the QR code below to connect:');
                qrcode.generate(qr, { small: true });
            }
            
            if (connection === 'close') {
                isConnected = false;
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
                
                logger.error('Connection closed due to:', lastDisconnect?.error);
                
                if (shouldReconnect) {
                    logger.info('Reconnecting...');
                    setTimeout(connectToWhatsApp, 3000);
                } else {
                    logger.error('Logged out. Please restart the bot and scan QR code again.');
                    process.exit(1);
                }
            } else if (connection === 'open') {
                isConnected = true;
                logger.success('WhatsApp connection established successfully!');
                logger.info(`Bot is now online and ready to receive messages`);
                logger.info(`Uptime: Bot started at ${startTime.toLocaleString()}`);
            }
        });

        // Handle credential updates
        sock.ev.on('creds.update', saveCreds);

        // Handle incoming messages
        sock.ev.on('messages.upsert', async (m) => {
            const message = m.messages[0];
            
            if (!message.message) return;
            if (message.key.fromMe) return; // Ignore messages sent by the bot itself
            
            const messageType = Object.keys(message.message)[0];
            let messageContent = '';
            
            // Extract message content based on type
            if (messageType === 'conversation') {
                messageContent = message.message.conversation;
            } else if (messageType === 'extendedTextMessage') {
                messageContent = message.message.extendedTextMessage.text;
            }
            
            if (!messageContent) return;
            
            const from = message.key.remoteJid;
            const isGroup = from.endsWith('@g.us');
            const sender = message.key.participant || from;
            
            // Log incoming message
            logger.message(`${isGroup ? 'Group' : 'Private'} message from ${sender}: ${messageContent}`);
            
            // Handle commands
            if (messageContent.startsWith('.') || messageContent.startsWith('!') || messageContent.toLowerCase() === 'ping') {
                await handleCommand(sock, from, messageContent, message, startTime);
            }
        });

    } catch (error) {
        logger.error('Error connecting to WhatsApp:', error);
        setTimeout(connectToWhatsApp, 5000);
    }
}

// Handle process termination
process.on('SIGINT', () => {
    logger.info('Bot shutting down...');
    if (sock) {
        sock.end();
    }
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the bot
logger.info('Starting WhatsApp Bot...');
logger.info('Available commands: .ping, .alive, .menu, ping');
connectToWhatsApp();

// Export for use in server.js
module.exports = { 
    getConnectionStatus: () => isConnected,
    getUptime: () => new Date() - startTime,
    getStartTime: () => startTime
};
