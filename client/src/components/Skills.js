import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Skills.css';

const Skills = () => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.2
    });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    const skills = [
        { name: 'HTML5/CSS3', level: 90, icon: '🌐' },
        { name: 'JavaScript', level: 85, icon: '⚡' },
        { name: 'React.js', level: 75, icon: '⚛️' },
        { name: 'Node.js', level: 70, icon: '🚀' },
        { name: 'Technical Support', level: 95, icon: '💻' },
        { name: 'MySQL', level: 80, icon: '🗄️' }
    ];

    const skillVariants = {
        hidden: { width: 0 },
        visible: (level) => ({
            width: `${level}%`,
            transition: { duration: 1, ease: "easeOut" }
        })
    };

    return (
        <section id="skills" className="skills">
            <div className="container">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2>Technical Skills</h2>
                    <div className="skills-container">
                        {skills.map((skill, index) => (
                            <motion.div
                                key={index}
                                className="skill-item"
                                initial={{ opacity: 0, x: -50 }}
                                animate={inView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="skill-info">
                                    <span className="skill-icon">{skill.icon}</span>
                                    <span className="skill-name">{skill.name}</span>
                                    <span className="skill-percentage">{skill.level}%</span>
                                </div>
                                <div className="skill-bar">
                                    <motion.div
                                        className="skill-progress"
                                        variants={skillVariants}
                                        initial="hidden"
                                        animate={controls}
                                        custom={skill.level}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;