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
    setModaleContent(works);
}

function isConnected() {
    var connected = localStorage.getItem('TOKEN');
    if (connected) {
        displayEditMode();
        switchlog();
        displayModale();
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
    const titlewrapperContent = `<a id="opendModale" href="#modale"><i class="fa-regular fa-pen-to-square"></i><span>Modifier</span></a>`;
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

function displayModale() {
    const modale = document.querySelector('#modale');
    const editBtn = document.querySelector('#opendModale');
    const modaleBody = document.querySelector('.modale__body');
    editBtn.onclick = (e) => {
        console.log('open modale ');
        modale.style.display = "block";
    }
    closeModal();
}

function closeModal() {
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

function setModaleContent(data) {
    console.log('modale data charger');
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

function init() {
    isConnected();
    displayData();
};

window.onload = (event) => {
    init()
};
