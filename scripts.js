document.querySelector('.menu-mobile').addEventListener('click', () => {
    const nav = document.querySelector('nav ul');
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});