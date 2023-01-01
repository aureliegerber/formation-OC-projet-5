const productItems = document.getElementById("items");

/**
 * Display products on the homepage
 * @param {array} response - Response of the API
 * @param {string} array[]._id
 * @param {string} array[].imageUrl
 * @param {string} array[].altTxt
 * @param {string} array[].name
 * @param {string} array[].description
 * @return {undefined}
 */

function displayProducts(array) {
    for (let i = 0; i < array.length; i++) {
        productItems.innerHTML += `
        <a href="./product.html?id=${array[i]._id}">
            <article>
                <img src="${array[i].imageUrl}" alt="${array[i].altTxt}">
                <h3 class="productName">${array[i].name}</h3>
                <p class="productDescription">${array[i].description}</p>
            </article>
        </a>`;
    }
}

/**
 * Retrieve data from the api and call the displayProducts function
 * @param {string} url - Url of the API
 * @return {undefined}
 */

fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value) {
        displayProducts(value);                    
    })
    .catch(function(err) {
        console.log(err);
    });