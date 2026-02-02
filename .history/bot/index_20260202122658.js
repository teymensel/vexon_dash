const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

client.once('ready', () => {
    console.log(`Bot is ready! Logged in as ${client.user.tag}`);
});

// Guild Join Event - Initialize Settings
client.on('guildCreate', async (guild) => {
    const { error } = await supabase
        .from('guild_settings')
        .upsert({
            guild_id: guild.id,
            name: guild.name,
            modules: {},
            config: {}
        });

    if (error) console.error('Error initializing guild settings:', error);
});

// Welcome Message Logic
client.on('guildMemberAdd', async (member) => {
    const { data, error } = await supabase
        .from('guild_settings')
        .select('*')
        .eq('guild_id', member.guild.id)
        .single();

    if (error || !data) return;

    // Check if "welcome" module is enabled
    if (data.modules && data.modules.welcome) {
        const welcomeChannelId = data.config && data.config.welcome_channel_id;
        if (welcomeChannelId) {
            const channel = member.guild.channels.cache.get(welcomeChannelId);
            if (channel) {
                const customMessage = data.config && data.config.welcome_message;
                const welcomeEmbed = new EmbedBuilder()
                    .setTitle('Hoş geldin! 🎉')
                    .setDescription(customMessage || `Merhaba ${member}, sunucumuza hoş geldin!`)
                    .setColor('#5865F2')
                    .setThumbnail(member.user.displayAvatarURL());

                channel.send({ embeds: [welcomeEmbed] });
            }
        }
    }
});

// Basic Commands
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const { data: settings } = await supabase
        .from('guild_settings')
        .select('*')
        .eq('guild_id', message.guild.id)
        .single();

    if (!settings) return;

    // Help Command (if enabled)
    if (message.content === '!yardim' || message.content === '!help') {
        if (settings.modules && settings.modules.help === false) return;

        const helpEmbed = new EmbedBuilder()
            .setTitle('Vexon Dash Yardım')
            .setDescription('Sitemiz üzerinden botu yönetebilirsiniz: [vexon.dash](http://localhost:3000)')
            .addFields(
                { name: '!yardim', value: 'Bu mesajı gösterir.' },
                { name: '!stats', value: 'Sunucu istatistiklerini gösterir.' }
            )
            .setColor('#5865F2');

        message.reply({ embeds: [helpEmbed] });
    }
});

client.login(process.env.DISCORD_TOKEN);
