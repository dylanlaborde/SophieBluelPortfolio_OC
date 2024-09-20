import { isConnected, workData, getWork, resetWorkdata ,getCategories} from './data.js';
import { displayData } from './app.js';

const modal1 = document.querySelector('#modale__container--project')
const modal2 = document.querySelector('#modale__container--upload')
const modale = document.querySelector('#modale');
const precedent = document.querySelector('.modale__previous');
const title = document.querySelector('.modale__title');
const modaleBody = document.querySelector('.modale__body');
const submitBtn = document.querySelector('.modale__submitBtn');
const modalBtn = document.querySelector('.modale__btn');
let categorySelect = document.getElementById('categorie__selected');
let validateHandle = false;

const initModal = () => {
    if (isConnected()) {
        displayModale()
        modaleListenner()
    }
}
const modaleListenner = () => {
    switchModal();
    handleForm()
    closeModal();
    
}

modalBtn.addEventListener('click', () => {
    switchModal();
    if (categorySelect.options.length == 0) {
        selectedCategorie();
    }

})

const displayModale = () => {
    const editBtn = document.querySelector('#opendModale');
    const containsArticles = modaleBody.querySelectorAll('.modale__article').length > 0;
    if (containsArticles) { modaleBody.innerHTML = '' }
    editBtn.onclick = (e) => {
        modale.style.display = "block";
    }
}
const emptyForm = () => {
    document.getElementById('modalForm').reset();
    const imgUploaded = document.querySelector('.modale__upload__img')
    const uploadWrapper = document.querySelector('.modale__upload__wrapper');
    const fileBtn = document.querySelector('#file__btn')
    let file = "";
    const img = uploadWrapper.querySelector('img');
    if (img) {
        uploadWrapper.removeChild(img);
    }
    imgUploaded.classList.remove('modale--hide')
    fileBtn.classList.remove('modale--hide')
}
const closeModal = () => {
    const btnClose = document.querySelector('.modale__close');
    btnClose.addEventListener('click', () => {
        modale.style.display = "none";
        switchModal("default");
    })
    window.addEventListener("click", (e) => {
        if (e.target === document.querySelector('aside')) {
            modale.style.display = "none";
            switchModal("default");

        };
    })
}
/*Suppresion*/
const deleteListenner = (e) => {
    const articleId = e.target.closest('.article__delete').id;
    handleDelete(articleId);
}
const handleDelete = async (id) => {
    const authToken = localStorage.getItem('TOKEN');
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
        }
    }
    try {
        let response = await fetch(`http://localhost:5678/api/works/${id}`, options)
        if (response.ok) {
            //on reset le cache pour refaire une requete 
            resetWorkdata();
            let updateData = await getWork();
            resetModal();
            displayData(updateData);
        }
    } catch (error) {
        console.error(error);
    }
    modale.style.display = "none";
}
const resetModal = () => {
    const modalContent = document.querySelector('#modale__container--project .modale__body');
    modalContent.innerHTML = ""
}
const switchModal = (reset) => {
    emptyForm();
    submitBtn.id = "modale__btn--disable";
    validateHandle = false
    if (title.innerHTML) {
        precedent.style.display = "block";
        title.innerHTML = "Ajouté Photo"
        modal1.style.display = "none"
        modal2.style.display = "block"
        
    }
    precedent.removeEventListener('click', backModal);
    precedent.addEventListener('click', backModal);
    if (reset === "default") {
        title.innerHTML = "Galerie Photo"
        modal1.style.display = "block"
        modal2.style.display = "none"
        precedent.style.display = "none"
    }
}
const backModal = () => {
    title.innerHTML = "Galerie Photo"
    modal1.style.display = "block"
    modal2.style.display = "none"
    precedent.style.display = "none"
}

const selectedCategorie = async () => {
    if (categorySelect.options.length > 0) return;
    
    let categoriesData = await getCategories();
    const optionDefault = document.createElement('option');
    categorySelect.appendChild(optionDefault);

    categoriesData.forEach((ctg) => {
        const option = document.createElement('option');
        option.value = ctg.id
        option.innerText = ctg.name
        categorySelect.appendChild(option)

    })

}

const handleForm = () => {
    const modalForm = document.querySelector('#modalForm');
    let titleInput = document.getElementById('title');
    let outpout;
    const uploadInput = document.querySelector('#file__upload');
    const imgUploaded = document.querySelector('.modale__upload__image')
    let file = uploadInput.files[0];
    //bouton de validation desativer (par default)
    submitBtn.id = "modale__btn--disable";
    emptyForm();
    //-------------------------------------
    /*------------- change on Form ----------------------------------- */
    const uploadWrapper = document.querySelector('.modale__upload__wrapper');
    modalForm.addEventListener('change', () => {
        const imgUploaded = document.querySelector('.modale__upload__image')
        const uploadInput = document.querySelector('#file__upload');
        let file = uploadInput.files[0];
        let reader = new FileReader();
        if (file && !imgUploaded) {
            reader.onload = ((e) => {
                document.querySelector('.modale__upload__img').classList.add('modale--hide');
                document.querySelector('#file__btn').classList.add('modale--hide')
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('modale__upload__image');
                uploadWrapper.append(img);
            })
            reader.readAsDataURL(file);
        }

        outpout = {
            'img': file,
            'titre': titleInput.value,
            'categorie': categorySelect.value
        }
        if (outpout.img && outpout.titre && outpout.categorie && !validateHandle) {
            submitBtn.removeAttribute('id');
            validateHandle = true;

        }
        if (!outpout.img || !outpout.titre || !outpout.categorie) {
            submitBtn.id = "modale__btn--disable";
        }
    })
    document.querySelector('.modale__submitBtn').addEventListener('click', async () => {
        if (validateHandle) {
            await handleSubmitForm(outpout)
            outpout = {};
            emptyForm();
            submitBtn.id = "modale__btn--disable";
            validateHandle = false
            switchModal('default');
            modale.style.display = "none";
        }
    })
}
const handleSubmitForm = async (dataToFetch) => {
    try {
        const authToken = localStorage.getItem('TOKEN');
        const url = 'http://localhost:5678/api/works';
        /* -------------Data to submit from Form---------- */
        const formData = new FormData();
        formData.append('title', dataToFetch.titre);
        formData.append('category', dataToFetch.categorie);
        formData.append('image', dataToFetch.img);
        /* ----------------------------------------------- */
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
            body: formData,
        };
        const response = await fetch(url, options);
        const data = await response.json();
        if (response.ok) {
            console.log('status : ', response.status)
            console.log('data :',data)
            resetWorkdata();
            const updateData = await getWork();
            displayData(updateData);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
export function setModaleContent(data) {
    const title = document.querySelector('.modale__title');
    title.innerHTML = 'Galerie Photo';
    const modaleBody = document.querySelector('.modale__body');
    modaleBody.innerHTML = "";
    const precedent = document.querySelector('.modale__previous');
    precedent.style.display = "none"
    data.forEach((element, i) => {
        let article = document.createElement('article');
        article.classList.add('modale__article');
        const imgModale = document.createElement('img')
        imgModale.id = data[i].id
        imgModale.src = data[i].imageUrl
        article.append(imgModale)
        const deleteWrapper = document.createElement('div')
        deleteWrapper.classList.add('article__delete__wrapper')
        const articleDelete = document.createElement('div')
        articleDelete.id = data[i].id
        articleDelete.classList.add('article__delete')
        const trashIcon = document.createElement('i');
        trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-2xs');
        articleDelete.append(trashIcon)
        deleteWrapper.append(articleDelete)
        articleDelete.addEventListener('click', deleteListenner)
        article.append(deleteWrapper)
        modaleBody.append(article)
    });
}
export default initModal;