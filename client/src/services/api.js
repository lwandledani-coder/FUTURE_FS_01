import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Contact form API
export const contactAPI = {
    submitMessage: async (formData) => {
        try {
            const response = await api.post('/api/contact/submit', formData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Network error' };
        }
    },
};

// Projects data (can be fetched from backend later)
export const projectsAPI = {
    getAllProjects: async () => {
        // For now, return static data
        return {
            success: true,
            data: [
                {
                    id: 1,
                    title: "Portfolio Website",
                    description: "A responsive personal portfolio website with dark mode and smooth animations.",
                    tech: ["React", "Node.js", "MySQL", "Express"],
                    demoLink: "#",
                    codeLink: "https://github.com/lwandledani-coder",
                    image: "portfolio.png"
                },
                {
                    id: 2,
                    title: "CRM System Project",
                    description: "A comprehensive Customer Relationship Management system for managing client interactions and sales processes.",
                    tech: ["React", "Node.js", "MongoDB", "Express"],
                    demoLink: "#",
                    codeLink: "https://github.com/lwandledani-coder",
                    image: "future-interns.png"
                },
                {
                    id: 3,
                    title: "CV Project",
                    description: "Digital resume and CV showcasing professional experience and skills.",
                    tech: ["HTML", "CSS", "React"],
                    demoLink: "#",
                    codeLink: "https://github.com/lwandledani-coder/linda-mthombeni-cv-project01",
                    image: "cv-project.png"
                }
            ]
        };
    }
};

export default api;