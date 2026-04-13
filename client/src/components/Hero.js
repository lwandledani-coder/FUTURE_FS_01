import React, { useEffect, useRef } from 'react';
import { FaLinkedin, FaGithub, FaTwitter, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
    const textRef = useRef(null);

    useEffect(() => {
        const text = textRef.current;
        if (text) {
            text.style.animation = 'animateText 5s linear infinite';
        }
    }, []);

    const socialLinks = [
        { icon: FaLinkedin, url: "#", title: "LinkedIn" },
        { icon: FaGithub, url: "#", title: "GitHub" },
        { icon: FaTwitter, url: "#", title: "Twitter" },
        { icon: FaFacebook, url: "#", title: "Facebook" }
    ];

    return (
        <section id="home" className="hero">
            <div className="hero-container">
                <motion.div
                    className="hero-image"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="profile-placeholder">
                        <span>LM</span>
                    </div>
                </motion.div>

                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h1>Hi, I'm Lindani Mthombeni</h1>
                    <h3 ref={textRef}>Technical Support & Full Stack Web Developer</h3>
                    <p>
                        Welcome to my personal professional portfolio website. I am a passionate and dedicated 
                        individual with a strong background in <strong>Technical Support</strong> and still advancing 
                        in <strong>Full-stack Web Development</strong>. With a keen eye for detail and a commitment 
                        to excellence, I strive to deliver high-quality work that exceeds expectations.
                    </p>

                    <div className="hero-social">
                        {socialLinks.map((social, index) => (
                            <motion.a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={social.title}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <social.icon />
                            </motion.a>
                        ))}
                    </div>

                    <motion.a
                        href="/cv.pdf"
                        className="btn btn-primary"
                        download
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Download CV
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;