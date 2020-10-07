const categories = Array.from(document.getElementsByClassName("cats"));

categories.forEach( category =>{
    category.addEventListener("click", e =>{
        const selectedCategory = e.target;
        const selectedCategoryNum = selectedCategory.id;
        localStorage.setItem('selectedCat',selectedCategoryNum);
    });
});