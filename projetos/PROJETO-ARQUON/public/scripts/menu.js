const btnMenu = document.getElementById('btn-menu');
const menu = document.getElementById('menu-mobile');
const iconeBotao = btnMenu.querySelector('i');
const linksMenu = document.querySelectorAll('#menu-mobile a');

btnMenu.addEventListener('click', () => {
    menu.classList.toggle('active');
    if(menu.classList.contains('active')) {
        iconeBotao.classList.className = 'fa-solid fa-xmark';
    } else {
        iconeBotao.classList.className = 'fa-solid fa-bars';
    }
});
