(function init() {
    GetWork();
    GetCategories();
})();

async function GetWork() {
    const url = "http://localhost:5678/api/works";
    const reponse = await fetch(url);
    const works = await reponse.json();
    console.log(works);
}    
async function GetCategories() {
    const url = "http://localhost:5678/api/categories";
    const reponse = await fetch(url);
    const categories = await reponse.json();
    console.log(categories);
}    
