const Contact = require('../models/Contact');

// Submit contact form
const submitContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Get IP address
        const ip_address = req.ip || req.connection.remoteAddress;
        const user_agent = req.headers['user-agent'];
        
        // Save to database
        const messageId = await Contact.saveMessage({
            name,
            email,
            message,
            ip_address,
            user_agent
        });
        
        res.status(201).json({
            success: true,
            message: 'Message sent successfully! I will get back to you soon.',
            messageId: messageId
        });
        
    } catch (error) {
        console.error('Error in submitContact:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message. Please try again later.'
        });
    }
};

// Get all messages (admin only)
const getAllMessages = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 100;
        const offset = parseInt(req.query.offset) || 0;
        
        const messages = await Contact.getAllMessages(limit, offset);
        const total = await Contact.getCount();
        const unread = await Contact.getUnreadCount();
        
        res.json({
            success: true,
            data: messages,
            pagination: {
                total,
                unread,
                limit,
                offset
            }
        });
    } catch (error) {
        console.error('Error in getAllMessages:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve messages'
        });
    }
};

// Get single message
const getMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Contact.getMessageById(id);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }
        
        // Mark as read if it was unread
        if (message.status === 'unread') {
            await Contact.updateStatus(id, 'read');
            message.status = 'read';
        }
        
        res.json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error('Error in getMessage:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve message'
        });
    }
};

// Update message status
const updateMessageStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['unread', 'read', 'replied'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status value'
            });
        }
        
        const updated = await Contact.updateStatus(id, status);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Status updated successfully'
        });
    } catch (error) {
        console.error('Error in updateMessageStatus:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update status'
        });
    }
};

// Delete message
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Contact.deleteMessage(id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.error('Error in deleteMessage:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete message'
        });
    }
};

module.exports = {
    submitContact,
    getAllMessages,
    getMessage,
    updateMessageStatus,
    deleteMessage
};