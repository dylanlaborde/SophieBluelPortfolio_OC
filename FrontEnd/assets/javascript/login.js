
const loginForm = document.querySelector('#loginform');
const loginUrl = "http://localhost:5678/api/users/login";

loginForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const errorContainer = document.querySelector('.error-box');
    const log = {
        email: e.target.querySelector('[name="email"]').value,
        password: e.target.querySelector('[name="password"]').value
    }
    //suppresion des erreur
    if (errorContainer) {
        errorContainer.innerHTML = " ";
        e.target.querySelector('[name="password"]').classList.remove("error");
        e.target.querySelector('[name="email"]').classList.remove("error");
        errorContainer.remove();
    }
    fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log)
    })
    .then(response => {
        if (!response.ok) {
            errorManangement(response);
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        //redirect and token storage here soon
        console.log('Success:', data);
    })
        .catch(error => {
             console.error('Error:', error.message);
    });
    
})

function errorManangement(err) {
    const field = loginForm.querySelectorAll('input');
    const errorInfo = document.createElement('div');
    let msgTodisplay;
    //mot de passe incorect
    if (err.status === 401) {
        field[1].classList.add('error');
        msgTodisplay = "Erreur Mot de Passe incorect !";
    }
    //mot de passe email incorect
    if (err.status === 404) {
        field[0].classList.add('error');
        field[1].classList.add('error');
        msgTodisplay = "Erreur Mot de Passe ou Email incorect !";
    }
    errorInfo.classList.add('error-box');
    errorInfo.innerHTML = msgTodisplay;
    loginForm.prepend(errorInfo);  
}
