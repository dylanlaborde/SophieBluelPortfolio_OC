let workData = null;
let categoriesData = null;

export const getWork = async () => {
    if (workData) {
        return workData;
    }
    try {
        const url = "http://localhost:5678/api/works";
        const reponse = await fetch(url);
        return workData = await reponse.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

export const getCategories = async () => {
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

export const resetWorkdata = () => {
    workData = null;
};

export { workData, categoriesData };