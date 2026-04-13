import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { projectsAPI } from '../services/api';
import './Projects.css';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const response = await projectsAPI.getAllProjects();
            if (response.success) {
                setProjects(response.data);
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section id="projects" className="projects">
            <div className="container">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2>My Projects</h2>
                    {loading ? (
                        <div className="loading-spinner">Loading projects...</div>
                    ) : (
                        <motion.div
                            className="projects-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                        >
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project.id || index}
                                    className="project-card"
                                    variants={itemVariants}
                                    whileHover={{ y: -10 }}
                                >
                                    <div className="project-image">
                                        <div className="project-placeholder">
                                            📁 {project.title.charAt(0)}
                                        </div>
                                    </div>
                                    <div className="project-content">
                                        <h3>{project.title}</h3>
                                        <p>{project.description}</p>
                                        <div className="project-tech">
                                            {project.tech.map((tech, i) => (
                                                <span key={i} className="tech-tag">{tech}</span>
                                            ))}
                                        </div>
                                        <div className="project-links">
                                            <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                                                <FaExternalLinkAlt /> Live Demo
                                            </a>
                                            <a href={project.codeLink} target="_blank" rel="noopener noreferrer">
                                                <FaGithub /> Code
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;