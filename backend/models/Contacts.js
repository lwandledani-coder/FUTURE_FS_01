const { pool } = require('../config/database');

class Contact {
    // Save contact message
    static async saveMessage(data) {
        const { name, email, message, ip_address, user_agent } = data;
        
        const query = `
            INSERT INTO contact_messages (name, email, message, ip_address, user_agent, status)
            VALUES (?, ?, ?, ?, ?, 'unread')
        `;
        
        const [result] = await pool.execute(query, [name, email, message, ip_address, user_agent]);
        return result.insertId;
    }
    
    // Get all messages (for admin)
    static async getAllMessages(limit = 100, offset = 0) {
        const query = `
            SELECT id, name, email, message, status, created_at 
            FROM contact_messages 
            ORDER BY created_at DESC 
            LIMIT ? OFFSET ?
        `;
        
        const [rows] = await pool.execute(query, [limit, offset]);
        return rows;
    }
    
    // Get single message
    static async getMessageById(id) {
        const query = 'SELECT * FROM contact_messages WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows[0];
    }
    
    // Update message status
    static async updateStatus(id, status) {
        const query = 'UPDATE contact_messages SET status = ? WHERE id = ?';
        const [result] = await pool.execute(query, [status, id]);
        return result.affectedRows > 0;
    }
    
    // Delete message
    static async deleteMessage(id) {
        const query = 'DELETE FROM contact_messages WHERE id = ?';
        const [result] = await pool.execute(query, [id]);
        return result.affectedRows > 0;
    }
    
    // Get message count
    static async getCount() {
        const query = 'SELECT COUNT(*) as total FROM contact_messages';
        const [rows] = await pool.execute(query);
        return rows[0].total;
    }
    
    // Get unread count
    static async getUnreadCount() {
        const query = "SELECT COUNT(*) as unread FROM contact_messages WHERE status = 'unread'";
        const [rows] = await pool.execute(query);
        return rows[0].unread;
    }
}

module.exports = Contact;