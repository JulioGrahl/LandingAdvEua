class Carrossel {
    constructor(container) {
        this.container = container;
        this.wrapper = container.closest('.carrossel-wrapper');
        this.track = container.querySelector('.carrossel-track');
        this.cards = Array.from(this.track.querySelectorAll('.area-card'));
        this.btnPrev = this.wrapper.querySelector('.anterior');
        this.btnNext = this.wrapper.querySelector('.proximo');
        this.currentIndex = 0;
        this.cardWidth = this.cards[0].offsetWidth + parseInt(window.getComputedStyle(this.cards[0]).marginRight) * 2;
        
        this.init();
    }

    init() {
        this.setupEvents();
        this.update();
        window.addEventListener('resize', () => this.handleResize());
    }

    setupEvents() {
        this.btnPrev.addEventListener('click', () => this.move(-1));
        this.btnNext.addEventListener('click', () => this.move(1));
        
        // Touch events - Versão melhorada para funcionar em todos os cards
        let startX, moveX;

        // Adiciona os eventos de toque a cada card individualmente
        this.cards.forEach(card => {
            card.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                this.track.style.transition = 'none';
            }, { passive: true });

            card.addEventListener('touchend', (e) => {
                moveX = e.changedTouches[0].clientX;
                if (Math.abs(startX - moveX) > 50) {
                    startX > moveX ? this.move(1) : this.move(-1);
                }
                this.track.style.transition = 'transform 0.5s ease';
            }, { passive: true });
        });

        // Mantém também os eventos no track como fallback
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.track.style.transition = 'none';
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            moveX = e.changedTouches[0].clientX;
            if (Math.abs(startX - moveX) > 50) {
                startX > moveX ? this.move(1) : this.move(-1);
            }
            this.track.style.transition = 'transform 0.5s ease';
        }, { passive: true });
    }

    move(step) {
        const maxIndex = this.cards.length - this.getVisibleCards();
        const newIndex = this.currentIndex + step;
        
        if (newIndex >= 0 && newIndex <= maxIndex) {
            this.currentIndex = newIndex;
            this.update();
        }
    }

    getVisibleCards() {
        const width = window.innerWidth;
        
        if (width < 768) return 1;
        if (width < 992) return 2;
        return 3;
    }

    handleResize() {
        this.cardWidth = this.cards[0].offsetWidth + parseInt(window.getComputedStyle(this.cards[0]).marginRight) * 2;
        this.update();
    }

    update() {
        const offset = this.currentIndex * this.cardWidth;
        this.track.style.transform = `translateX(-${offset}px)`;
        
        // Atualiza botões
        const maxIndex = this.cards.length - this.getVisibleCards();
        this.btnPrev.disabled = this.currentIndex === 0;
        this.btnNext.disabled = this.currentIndex >= maxIndex;
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    new Carrossel(document.querySelector('.carrossel-container'));
});

// Animação de contagem dos números - Versão melhorada
const statNumbers = document.querySelectorAll('.stat-number');

function animateNumbers() {
    statNumbers.forEach(number => {
        const target = +number.getAttribute('data-count');
        const duration = 3000; // 2 segundos para completar a animação
        const startTime = performance.now();
        const startValue = 0;
        const easeOutQuad = t => t * (2 - t); // Função de easing para suavizar

        function updateCount(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeOutQuad(progress);
            const currentValue = Math.floor(startValue + (target - startValue) * easedProgress);
            
            // Formatação com separadores de milhar (opcional)
            number.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                number.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(updateCount);
    });
}

// Observador de interseção para disparar a animação quando o elemento estiver visível
const statsSection = document.querySelector('.stats-section');
const observerOptions = {
    threshold: 0.5 // Dispara quando 50% do elemento estiver visível
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            observer.unobserve(entry.target); // Para a observação após disparar
        }
    });
}, observerOptions);

if (statsSection) {
    observer.observe(statsSection);
}
    
    // Ativar animação quando a seção estiver visível
    function checkStatsVisibility() {
        const statsSection = document.querySelector('.stats-section');
        const statsPosition = statsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (statsPosition < screenPosition) {
            animateNumbers();
            window.removeEventListener('scroll', checkStatsVisibility);
        }
    }
    
    window.addEventListener('scroll', checkStatsVisibility);
    
    
    
    // Animação de revelação ao scroll
    const fadeElements = document.querySelectorAll('.fade-in-up');
    
    function checkFadeElements() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.classList.add('fade-in-up');
            }
        });
    }
    
    // Verificar elementos na carga inicial
    checkFadeElements();
    
    // Verificar elementos durante o scroll
    window.addEventListener('scroll', checkFadeElements);
    
    // Atualizar ano no footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    
    // Efeito de digitação no título do hero
    const heroTitleLines = document.querySelectorAll('.title-line');
    
    heroTitleLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        
        setTimeout(() => {
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, 100);
        }, index * 1000);
    });