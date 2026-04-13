const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const createEmailTransporter = () => {
    const host = process.env.EMAIL_HOST;
    const port = Number(process.env.EMAIL_PORT || 587);
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!host || !user || !pass) {
        console.warn('Email transporter not configured. EMAIL_HOST, EMAIL_USER, and EMAIL_PASS must be set.');
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass,
        },
    });
};

const sendNotificationEmail = async ({ name, email, message, ip_address, user_agent }) => {
    const transporter = createEmailTransporter();
    if (!transporter) return false;

    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: adminEmail,
        subject: `New contact form message from ${name}`,
        text: `You have received a new contact form message:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\nIP Address: ${ip_address}\nUser Agent: ${user_agent}\n`,
        html: `
            <h2>New contact form message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <p><strong>IP Address:</strong> ${ip_address}</p>
            <p><strong>User Agent:</strong> ${user_agent}</p>
        `,
    };

    await transporter.sendMail(mailOptions);
    return true;
};

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'portfolio_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ MySQL connection failed:', error.message);
        return false;
    }
};

// Middleware
app.use(helmet());
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5500',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'file://'
];
app.use(cors({
    origin: (origin, callback) => {
        // Allow null origin (file:// protocol) and whitelisted origins
        if (!origin || origin === 'null' || origin === 'file://' || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all for development
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Contact form endpoint
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
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email address'
            });
        }
        
        // Save to database
        const query = `
            INSERT INTO contact_messages (name, email, message, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const ip_address = req.ip || req.connection.remoteAddress;
        const user_agent = req.headers['user-agent'];
        
        const [result] = await pool.execute(query, [name, email, message, ip_address, user_agent]);
        
        let emailSent = false;
        try {
            emailSent = await sendNotificationEmail({ name, email, message, ip_address, user_agent });
        } catch (emailError) {
            console.error('Email notification failed:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Message sent successfully! I will get back to you soon.',
            messageId: result.insertId,
            emailNotification: emailSent
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

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
const startServer = async () => {
    await testConnection();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📧 Contact form API: http://localhost:${PORT}/api/contact/submit`);
        console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    });
};

startServer();