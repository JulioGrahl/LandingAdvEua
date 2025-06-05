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
        
        // Touch events
        let startX, moveX;
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