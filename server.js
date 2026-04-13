const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test MySQL connection
const testDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL connected successfully');
        connection.release();
    } catch (error) {
        console.error('❌ MySQL connection failed:', error.message);
    }
};

testDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Contact form endpoint with MySQL
app.post('/api/contact/submit', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                error: 'All fields are required'
            });
        }
        
        // Get IP address
        const ip_address = req.ip || req.connection.remoteAddress;
        const user_agent = req.headers['user-agent'];
        
        // Save to database
        const query = `
            INSERT INTO contact_messages (name, email, message, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const [result] = await pool.execute(query, [name, email, message, ip_address, user_agent]);
        
        res.json({
            success: true,
            message: 'Message sent successfully! I will get back to you soon.',
            messageId: result.insertId
        });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message. Please try again later.'
        });
    }
});

// Get all messages (for admin)
app.get('/api/contact/messages', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM contact_messages ORDER BY created_at DESC'
        );
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve messages'
        });
    }
});

// Update CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:3000'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Contact form: http://localhost:${PORT}/api/contact/submit`);
    console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
});