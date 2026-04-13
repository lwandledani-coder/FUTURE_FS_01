import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './About.css';

const About = () => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    return (
        <section id="about" className="about">
            <div className="container">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="about-content"
                >
                    <h2>About Me</h2>
                    <div className="about-text">
                        <p>
                            I'm Lindani Mthombeni, a passionate Technical Support Specialist and Full Stack Web Developer 
                            with a strong commitment to delivering high-quality solutions. My journey in tech has equipped 
                            me with both technical expertise and excellent problem-solving skills.
                        </p>
                        <p>
                            With a background in technical support, I understand the importance of user experience and 
                            reliable systems. Currently, I'm expanding my skills in full-stack development to build 
                            complete, end-to-end web applications that make a difference.
                        </p>
                        <p>
                            When I'm not coding, I enjoy learning new technologies, contributing to open-source projects, 
                            and staying updated with the latest industry trends.
                        </p>
                    </div>

                    <div className="about-info">
                        <div className="info-item">
                            <h4>📍 Location</h4>
                            <p>South Africa</p>
                        </div>
                        <div className="info-item">
                            <h4>📧 Email</h4>
                            <p>lindani.mthombeni@example.com</p>
                        </div>
                        <div className="info-item">
                            <h4>🎓 Education</h4>
                            <p>Full Stack Web Development</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;