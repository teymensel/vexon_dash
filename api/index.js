const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- AUTH ENDPOINTS ---

app.post('/auth/discord', async (req, res) => {
    const { code } = req.body;

    try {
        // 1. Exchange code for access token
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID,
            client_secret: process.env.DISCORD_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.DISCORD_REDIRECT_URI,
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token, refresh_token } = tokenResponse.data;

        // 2. Fetch user profile
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const user = userResponse.data;

        // 3. Create session JWT
        const sessionToken = jwt.sign({
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            access_token: access_token
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token: sessionToken, user });

    } catch (error) {
        console.error('Discord Auth Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// --- GUILD ENDPOINTS ---

app.get('/user/guilds', authenticateToken, async (req, res) => {
    try {
        const response = await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: { Authorization: `Bearer ${req.user.access_token}` }
        });

        // Filter guilds where user has Admin or Manage Server
        const guilds = response.data.filter(g => (g.permissions & 0x8) === 0x8 || (g.permissions & 0x20) === 0x20);
        res.json(guilds);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch guilds' });
    }
});

app.get('/guilds/:guildId/settings', authenticateToken, async (req, res) => {
    const { guildId } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM guild_settings WHERE guild_id = ?', [guildId]);
        if (rows.length === 0) {
            // Return default settings
            return res.json({ modules: {}, config: {} });
        }
        res.json({
            modules: JSON.parse(rows[0].modules || '{}'),
            config: JSON.parse(rows[0].config || '{}')
        });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/guilds/:guildId/settings', authenticateToken, async (req, res) => {
    const { guildId } = req.params;
    const { modules, config } = req.body;

    try {
        const modulesStr = JSON.stringify(modules || {});
        const configStr = JSON.stringify(config || {});

        await pool.query(
            'INSERT INTO guild_settings (guild_id, modules, config) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE modules = ?, config = ?, updated_at = CURRENT_TIMESTAMP',
            [guildId, modulesStr, configStr, modulesStr, configStr]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Save Settings Error:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Vexon API running on http://localhost:${PORT}`);
});
