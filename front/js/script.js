let productItems = document.getElementById("items");

/**
 * Display products on the homepage
 * @param {array}
 * @return {HTMLElement}
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
 * @param {url}
 * @return {promise}
 */

let promise = fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value) {
        displayProducts(value);
                    
    })
    .catch(function(err) {
        console.log("error")
    });

