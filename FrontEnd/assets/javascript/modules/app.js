import { getWork, getCategories,workData , categoriesData , isConnected} from './data.js';
import { setModaleContent } from './modal.js'

const init = async() => {
    displayDomElement();
    displayData();
};

const displayCategories = async () => {
    await getCategories();
    categoriesData.unshift({ id: 0, name: 'Tous' })
    const filtre = document.querySelectorAll('.filtre');
    categoriesData.forEach(element => {
        const div = document.createElement('div');
        if (document.querySelectorAll('.filtreBtn--active').length === 0) {
            div.classList.add('filtreBtn--active');
        }
        div.classList.add('filtreBtn');
        div.innerHTML = element.name;
        div.addEventListener('click', () => {
            let selected = document.querySelector('.filtreBtn--active');
            selected.classList.remove('filtreBtn--active');
            div.classList.add('filtreBtn--active');
            filterData(element.id);
        })
        filtre[0].append(div);
    });
}
const filterData = async (fltrId) => {
    if (fltrId === 0) { displayData() }
    else {
        const result = workData.filter((work) => work.categoryId === fltrId);
        displayData(result);
    }
}
const displayData = async (filtered) => {    
    let data = filtered || await getWork();
    const gallery = document.querySelector('.gallery');
    document.querySelector('.gallery').innerHTML = "";
    data.forEach((element, i) => {
        const figure = document.createElement('Figure');
        const content = `<img src="${element.imageUrl}" alt="${element.title}">
                         <figcaption>${element.title}</figcaption>`;
        figure.innerHTML = content;
        gallery.appendChild(figure);
    });
   setModaleContent(workData);
}

const displayDomElement = () => {
    if (isConnected()) {
        displayEditMode();
        switchlog();
    } else {
        displayCategories();
    }
}

const displayEditMode = () => {
    //bare de mode edition en haut de page
    const editBar = document.createElement('div');
    editBar.classList.add('editContainer');
    const editContent = `
                        <div class="edit">
                            <i class="fa-regular fa-pen-to-square"></i>
                            <span>Mode Edition</span>
                        </div>
                        `
    editBar.innerHTML = editContent;
    document.body.prepend(editBar);
    //bouton modifier
    const titlewrapper = document.querySelector('.title-wrapper');
    const div = document.createElement('div');
    const titlewrapperContent = `<a id="opendModale" href="#modale"><i class="fa-regular fa-pen-to-square"></i><span>Modifier</span></a>`;
    div.innerHTML = titlewrapperContent;
    titlewrapper.classList.add('title-wrapper--edit')
    titlewrapper.append(div);
    //cacher filtre   
    const filtre = document.querySelectorAll('.filtre');
    filtre[0].remove();
   
}

const switchlog = () => {
    const logInOut = document.querySelector('.logInOut');
    const logout = '<a href="#logout" class="logout">logout</a>'
    logInOut.innerHTML = logout;
    logInOut.addEventListener('click', (e) => {
        localStorage.removeItem('TOKEN');
        window.location.href = 'index.html';
    })
}

export default init;