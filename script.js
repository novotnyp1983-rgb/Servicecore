// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    });

    // Close menu when clicking navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('open');
            navMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
        });
    });
}

// Active Nav Link highlighting on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        
        const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
});

// Stats counting animation
const stats = document.querySelectorAll('.stat-num');
let animated = false;

const startCounting = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
            stats.forEach(stat => {
                const target = +stat.getAttribute('data-target');
                const duration = 1500; // Animation duration in ms
                const increment = target / (duration / 16); // ~60fps
                
                let current = 0;
                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        stat.innerText = Math.ceil(current);
                        setTimeout(updateCount, 16);
                    } else {
                        stat.innerText = target;
                    }
                };
                updateCount();
            });
            animated = true;
            observer.disconnect(); // Only animate once
        }
    });
};

const statsObserver = new IntersectionObserver(startCounting, {
    threshold: 0.5
});

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Contact form handling with AJAX
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

const formMessages = {
    cs: {
        sending: 'Odesílám...',
        missingKey: 'Chyba: Formulář není plně nakonfigurován. V kódu schází přístupový klíč k e-mailové službě (Access Key). Podívejte se prosím do souboru DEPLOYNÁVOD.md.',
        success: 'Děkuji! Vaše poptávka byla úspěšně odeslána. Ozvu se vám co nejdříve.',
        error: 'Nastala chyba při odesílání formuláře. Zkuste to prosím znovu nebo mě kontaktujte napřímo.',
        networkError: 'Nelze se spojit se serverem. Zkontrolujte prosím připojení k internetu, případně mě kontaktujte přímo přes e-mail či telefon.'
    },
    en: {
        sending: 'Sending...',
        missingKey: 'Error: The form is not fully configured. Access Key is missing in the code.',
        success: 'Thank you! Your inquiry has been sent successfully. I will get back to you as soon as possible.',
        error: 'An error occurred while sending the form. Please try again or contact me directly.',
        networkError: 'Unable to connect to the server. Please check your internet connection or contact me directly via email or phone.'
    },
    de: {
        sending: 'Wird gesendet...',
        missingKey: 'Fehler: Das Formular ist nicht vollständig konfiguriert. Der Access Key fehlt im Code.',
        success: 'Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet. Ich melde mich schnellstmöglich bei Ihnen.',
        error: 'Beim Senden des Formulars ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie mich direkt.',
        networkError: 'Keine Verbindung zum Server möglich. Bitte prüfen Sie Ihre Internetverbindung oder kontaktieren Sie mich direkt per E-Mail oder Telefon.'
    }
};

if (contactForm && formStatus) {
    const lang = (document.documentElement.lang || 'cs').toLowerCase().slice(0, 2);
    const msgs = formMessages[lang] || formMessages.cs;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        const origBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span>${msgs.sending}</span>`;
        
        formStatus.className = 'form-status';
        formStatus.style.display = 'none';

        // Check if user set the Access Key
        const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
        if (!accessKeyInput || accessKeyInput.value === 'YOUR_ACCESS_KEY_HERE') {
            formStatus.innerText = msgs.missingKey;
            formStatus.classList.add('error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnText;
            return;
        }

        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            
            if (response.ok) {
                formStatus.innerText = msgs.success;
                formStatus.classList.add('success');
                contactForm.reset();
            } else {
                formStatus.innerText = result.message || msgs.error;
                formStatus.classList.add('error');
            }
        } catch (error) {
            formStatus.innerText = msgs.networkError;
            formStatus.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origBtnText;
        }
    });
}
