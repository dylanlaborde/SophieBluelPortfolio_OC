import { isConnected , workData , getWork , resetWorkdata} from './data.js';
import { displayData } from './app.js';

const initModal = () => {
    if (isConnected()) {
        displayModale()
    }
}

const displayModale = () => {
    const modale = document.querySelector('#modale');
    const editBtn = document.querySelector('#opendModale');
    const modaleBody = document.querySelector('.modale__body');
    const containsArticles = modaleBody.querySelectorAll('.modale__article').length > 0;
    if(containsArticles){modaleBody.innerHTML = ''}
    editBtn.onclick = (e) => {
        console.log('open modale ');
        modale.style.display = "block";
        deleteListenner();
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
            <div id="${element.id}" class="article__delete">
                <i class="fa-solid fa-trash-can fa-2xs"></i>
            </div>	
        </div>`
        article.innerHTML = articleContent;
        modaleBody[0].append(article);
    })

}

const deleteListenner = () => {
    const deleteBtns = document.querySelectorAll('.article__delete');
    const authToken = localStorage.getItem('TOKEN');
    deleteBtns.forEach((btn,i) => {
        btn.addEventListener('click', async(e) => {
            e.preventDefault();
            const articleId = e.target.closest('.article__delete').id;
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                }
            }
            let response = await fetch(`http://localhost:5678/api/works/${articleId}`, options)
            if (response.ok) {
                //on reset le cache pour refaire une requete 
                await resetWorkdata();
                let updateData = await getWork();
                displayModale();
                displayData(updateData);
                deleteListenner();
            }
        });
    })
}


export default initModal;