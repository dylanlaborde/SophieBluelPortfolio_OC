import { isConnected } from './data.js';

const initModal = () => {
    if (isConnected()) {
        displayModale()
    }
}

const displayModale = () => {
    const modale = document.querySelector('#modale');
    const editBtn = document.querySelector('#opendModale');
    const modaleBody = document.querySelector('.modale__body');
    editBtn.onclick = (e) => {
        console.log('open modale ');
        modale.style.display = "block";
    }
    closeModal();
}

const closeModal = () => {
    const btnClose = document.querySelector('.modale__close');
    btnClose.addEventListener('click', () => {
        modale.style.display = "none";
    })
    window.addEventListener("click", (e) => {
        if (e.target === document.querySelector('aside')) {
            modale.style.display = "none";
        };
    })
}

export function setModaleContent(data) {
    const modaleBody = document.querySelectorAll('.modale__body');
    data.forEach((element, i) => {
        let article = document.createElement('article');
        article.classList.add('modale__article');
        let articleContent = `
        <img id="${element.id}" src="${element.imageUrl}" alt="${element.title}">
        <div class="article__delete__wrapper">
            <div class="article__delete">
                <i class="fa-solid fa-trash-can fa-2xs"></i>
            </div>	
        </div>`
        article.innerHTML = articleContent;
        modaleBody[0].append(article);
    })

}

export default initModal;