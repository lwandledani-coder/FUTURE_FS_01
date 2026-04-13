// Dark Mode Toggle
const toggleIcon = document.querySelector('.toggle-icon');
const body = document.body;

// Check for saved dark mode preference
const darkModePreference = localStorage.getItem('darkMode');
if (darkModePreference === 'enabled') {
    body.classList.add('dark-mode');
    toggleIcon.classList.remove('bi-moon');
    toggleIcon.classList.add('bi-sun');
} else {
    toggleIcon.classList.remove('bi-sun');
    toggleIcon.classList.add('bi-moon');
}

// Toggle dark mode on click
toggleIcon.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        toggleIcon.classList.remove('bi-moon');
        toggleIcon.classList.add('bi-sun');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        toggleIcon.classList.remove('bi-sun');
        toggleIcon.classList.add('bi-moon');
        localStorage.setItem('darkMode', 'disabled');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active class
            document.querySelectorAll('.navbar a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Active Navigation Highlight on Scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Skill Bar Animation on Scroll
const skillBars = document.querySelectorAll('.skill-progress');

const animateSkills = () => {
    skillBars.forEach(bar => {
        const barPosition = bar.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if (barPosition < screenPosition) {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        }
    });
};

window.addEventListener('scroll', animateSkills);
window.addEventListener('load', animateSkills);

// Contact form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('http://localhost:5000/api/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                mode: 'cors',
                credentials: 'include'
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                showNotification(data.message, 'success');
                contactForm.reset();
            } else {
                throw new Error(data.error || 'Failed to send message');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showNotification(error.message || 'Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Notification helper function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Mobile Menu Toggle
const menuBtn = document.createElement('div');
menuBtn.className = 'menu-btn';
menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.header');

if (window.innerWidth <= 768 && !document.querySelector('.menu-btn')) {
    header.insertBefore(menuBtn, navbar);
}

menuBtn.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// Close mobile menu when clicking a link
navbar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navbar.classList.remove('active');
        }
    });
});

// Dynamic Projects Loading
const projectsData = [
    {
        title: "Portfolio Website",
        description: "A responsive personal portfolio website with dark mode and smooth animations.",
        tech: ["HTML", "CSS", "JavaScript"],
        demoLink: "#",
        codeLink: "https://github.com/lwandledani-coder"
    },
    {
        title: "Future Interns Task 1",
        description: "Professional portfolio website built as part of Full Stack Web Development internship.",
        tech: ["HTML", "CSS", "JavaScript", "Bootstrap"],
        demoLink: "#",
        codeLink: "https://github.com/lwandledani-coder"
    },
    {
        title: "CV Project",
        description: "Digital resume and CV showcasing professional experience and skills.",
        tech: ["HTML", "CSS"],
        demoLink: "#",
        codeLink: "https://github.com/lwandledani-coder/linda-mthombeni-cv-project01"
    }
];

const loadProjects = () => {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = '';
    projectsData.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div class="project-image">
                <i class="fas fa-code"></i>
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.demoLink}" target="_blank">Live Demo →</a>
                    <a href="${project.codeLink}" target="_blank">GitHub →</a>
                </div>
            </div>
        `;
        projectsGrid.appendChild(projectCard);
    });
};

// Initialize projects when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});

// Analytics Tracking
const socialLinks = document.querySelectorAll('.home-social-icons a');

socialLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const platform = link.getAttribute('title');
    });
});

// Download CV functionality
const downloadBtn = document.querySelector('.btn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const cvUrl = 'https://github.com/lwandledani-coder/linda-mthombeni-cv/Lindani-C-Mthombeni-resume.pdf';
        window.open(cvUrl, '_blank');
    });
}