let workData = null;
let categoriesData = null;

export const getWork = async()=> {
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

export const getCategories = async ()=> {
    try {
        const url = "http://localhost:5678/api/categories";
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        categoriesData = await response.json();
        return categoriesData;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

export const isConnected = () =>{
    var connected = localStorage.getItem('TOKEN');
    if (!connected) {
        return false
    } else {
        return true
    }
}

export { workData, categoriesData };