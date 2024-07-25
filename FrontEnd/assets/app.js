let workData = null;

async function GetWork() {
    if (!workData) {
        try {
            const url = "http://localhost:5678/api/works";
            const reponse = await fetch(url);
            workData = await reponse.json();
            return workData;
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }
    return workData;
}

async function GetCategories() {
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
    const data = await GetCategories();
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
    if (!workData) {
        var works = await GetWork();
    } if (workData && filterData) {
        var works = filtered;
    } if (workData && !filtered) {
        var works = workData;
    }
    document.querySelector('.gallery').innerHTML = "";
    works.forEach((element, i) => {
        const gallery = document.querySelector('.gallery');
        const figure = document.createElement('Figure');
        const content = `<img src="${element.imageUrl}" alt="${element.title}">
                         <figcaption>${element.title}</figcaption>`;
        figure.innerHTML = content;
        gallery.appendChild(figure);
    });
}

(function init() {
    displayCategories();
    displayData();
})();

