const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Database Connection
let pool;
async function initDB() {
    pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'vexon_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

client.once('ready', async () => {
    await initDB();
    console.log(`Bot is ready! Logged in as ${client.user.tag}`);
});

// Guild Join Event
client.on('guildCreate', async (guild) => {
    try {
        await pool.query(
            'INSERT INTO guild_settings (guild_id, modules, config) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP',
            [guild.id, '{}', '{}']
        );
    } catch (error) {
        console.error('Error initializing guild settings:', error);
    }
});

// Welcome Message Logic
client.on('guildMemberAdd', async (member) => {
    try {
        const [rows] = await pool.query('SELECT * FROM guild_settings WHERE guild_id = ?', [member.guild.id]);
        if (rows.length === 0) return;

        const data = rows[0];
        const modules = JSON.parse(data.modules || '{}');
        const config = JSON.parse(data.config || '{}');

        if (modules.welcome) {
            const welcomeChannelId = config.welcome_channel_id;
            if (welcomeChannelId) {
                const channel = member.guild.channels.cache.get(welcomeChannelId);
                if (channel) {
                    const customMessage = config.welcome_message;
                    const welcomeEmbed = new EmbedBuilder()
                        .setTitle('Hoş geldin! 🎉')
                        .setDescription(customMessage || `Merhaba ${member}, sunucumuza hoş geldin!`)
                        .setColor('#5865F2')
                        .setThumbnail(member.user.displayAvatarURL());

                    channel.send({ embeds: [welcomeEmbed] });
                }
            }
        }
    } catch (error) {
        console.error('Welcome message error:', error);
    }
});

// Basic Commands
client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    try {
        const [rows] = await pool.query('SELECT * FROM guild_settings WHERE guild_id = ?', [message.guild.id]);
        const settings = rows[0] ? {
            modules: JSON.parse(rows[0].modules || '{}'),
            config: JSON.parse(rows[0].config || '{}')
        } : null;

        if (!settings) return;

        if (message.content === '!yardim' || message.content === '!help') {
            if (settings.modules.help === false) return;

            const helpEmbed = new EmbedBuilder()
                .setTitle('Vexon Dash Yardım')
                .setDescription('Sitemiz üzerinden botu yönetebilirsiniz: [vexon.dash](https://vexon.teymensel.com)')
                .addFields(
                    { name: '!yardim', value: 'Bu mesajı gösterir.' },
                    { name: '!stats', value: 'Sunucu istatistiklerini gösterir.' }
                )
                .setColor('#5865F2');

            message.reply({ embeds: [helpEmbed] });
        }
    } catch (error) {
        console.error('Command error:', error);
    }
});

client.login(process.env.DISCORD_TOKEN);
