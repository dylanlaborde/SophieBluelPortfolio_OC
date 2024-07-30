let workData = null;
async function getWork() {
    if (!workData) {
        try {
            const url = "http://localhost:5678/api/works";
            const reponse = await fetch(url);
            workData = await reponse.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }
    return workData;
}

async function getCategories() {
    try {
        const url = "http://localhost:5678/api/categories";
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}
async function displayCategories() {
    const data = await getCategories();
    data.unshift({ id: 0, name: 'Tous' })
    const filtre = document.querySelectorAll('.filtre');
    data.forEach(element => {
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
async function filterData(fltrId) {
    if (fltrId === 0) { displayData() }
    else {
        const result = workData.filter((work) => work.categoryId === fltrId);
        displayData(result);
    }
}
async function displayData(filtered) {
    const works = filtered || await getWork();
    const gallery = document.querySelector('.gallery');
    document.querySelector('.gallery').innerHTML = "";
    works.forEach((element, i) => {
        const figure = document.createElement('Figure');
        const content = `<img src="${element.imageUrl}" alt="${element.title}">
                         <figcaption>${element.title}</figcaption>`;
        figure.innerHTML = content;
        gallery.appendChild(figure);
    });
}

function isConnected() {
    var connected = localStorage.getItem('TOKEN');
    if (connected) {
        displayEditMode();
        switchlog();
    } else {
        displayCategories();
    }
}

function displayEditMode() {
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
    const titlewrapperContent = `<a href="#modale"><i class="fa-regular fa-pen-to-square"></i><span>Modifier</span></a>`;
    div.innerHTML = titlewrapperContent;
    titlewrapper.classList.add('title-wrapper--edit')
    titlewrapper.append(div);
    //cacher filtre   
    const filtre = document.querySelectorAll('.filtre');
    filtre[0].remove();
   
}

function switchlog() {
    const logInOut = document.querySelector('.logInOut');
    const logout = '<a href="#logout" class="logout">logout</a>'
    logInOut.innerHTML = logout;
    logInOut.addEventListener('click', (e) => {
        localStorage.removeItem('TOKEN');
        window.location.href = 'index.html';
    })
}

function init() {
    isConnected();
    displayData();
};

window.onload = (event) => {
    init()
};
