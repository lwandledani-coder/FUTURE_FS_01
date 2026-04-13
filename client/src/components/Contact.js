import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import { contactAPI } from '../services/api';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState({
        loading: false,
        success: false,
        error: null
    });
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setStatus({ loading: true, success: false, error: null });
        
        try {
            const response = await contactAPI.submitMessage(formData);
            if (response.success) {
                setStatus({ loading: false, success: true, error: null });
                setFormData({ name: '', email: '', message: '' });
                
                // Clear success message after 5 seconds
                setTimeout(() => {
                    setStatus({ loading: false, success: false, error: null });
                }, 5000);
            }
        } catch (error) {
            setStatus({
                loading: false,
                success: false,
                error: error.error || 'Failed to send message. Please try again.'
            });
        }
    };

    const contactInfo = [
        { icon: FaEnvelope, text: 'lindani.mthombeni@example.com', link: 'mailto:lindani.mthombeni@example.com' },
        { icon: FaPhone, text: '+27 XX XXX XXXX', link: 'tel:+27XXXXXXXXX' },
        { icon: FaMapMarkerAlt, text: 'South Africa', link: null }
    ];

    return (
        <section id="contact" className="contact">
            <div className="container">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Get In Touch</h2>
                    <div className="contact-container">
                        <div className="contact-info">
                            {contactInfo.map((info, index) => (
                                <div key={index} className="info-item">
                                    <info.icon />
                                    {info.link ? (
                                        <a href={info.link}>{info.text}</a>
                                    ) : (
                                        <p>{info.text}</p>
                                    )}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <textarea
                                    name="message"
                                    placeholder="Your Message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                className="submit-btn"
                                disabled={status.loading}
                            >
                                {status.loading ? (
                                    'Sending...'
                                ) : (
                                    <>
                                        <FaPaperPlane /> Send Message
                                    </>
                                )}
                            </button>
                            
                            {status.success && (
                                <div className="success-message">
                                    ✓ Message sent successfully! I'll get back to you soon.
                                </div>
                            )}
                            
                            {status.error && (
                                <div className="error-message">
                                    ✗ {status.error}
                                </div>
                            )}
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;