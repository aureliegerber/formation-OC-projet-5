const url = new URLSearchParams(window.location.search);
const productId = url.get("id");
const itemImg = document.querySelector(".item__img");
const itemContentTitle = document.getElementById("title");
const itemContentPrice = document.getElementById("price");
const itemContentDescription = document.getElementById("description");
const itemContentSettingsColor = document.getElementById("colors");

/**
 * Display product details
 * @param {array} response - Response of the API
 * @param {string} array[]._id
 * @param {string} array[].imageUrl
 * @param {string} array[].altTxt
 * @param {string} array[].name
 * @param {number} array[].price
 * @param {string} array[].description
 * @param {array} array[].color
 * @return {undefined}
 */

function displayProduct(array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i]._id === productId) {
            itemImg.innerHTML = `<img src="${array[i].imageUrl}" alt="${array[i].altTxt}">`;
            itemContentTitle.textContent = array[i].name;
            itemContentPrice.textContent = array[i].price;
            itemContentDescription.textContent = array[i].description;
            for (let j = 0; j < array[i].colors.length; j++) {
                itemContentSettingsColor.innerHTML += `
                <option value="${array[i].colors[j]}">${array[i].colors[j]}</option>`
            }             
        }
    }
}

/**
 * Retrieve data from the api and call the displayProduct function
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
        displayProduct(value);                     
    })
    .catch(function(err) {
        console.log(err);
    });

let cart = [];
let storedCart = JSON.parse(localStorage.getItem("cart"));

/**
 * Check that the color and quantity have been chosen
 * @param {string} color
 * @param {number} quantity
 * @return {undefined}
 */

function checkInput(color, quantity) {
    if (color == "" && quantity == 0) {
        alert("Choisir une couleur et saisir une quantité");
    }
    if (color == "" && quantity !== 0) {
        alert("Choisir une couleur");
    }
    if (color !== "" && quantity == 0) {
        alert("Saisir une quantité");
    }
    if (quantity > 100) {
        alert("Saisir une quantité comprise entre 1 et 100");
    }
}

/**
 * Fill the cart
 * @param none
 * @return {undefined}
 */

function fillCart() {
    if (storedCart !== null) {
        cart = storedCart;
    }

    let productQuantity = parseInt(document.getElementById("quantity").value);
    let productColor = document.getElementById("colors").value;
    let boolean = false;

    checkInput(productColor, productQuantity);    
    
    if (productColor !== "" && productQuantity > 0 && productQuantity <= 100) {
        if (cart.length == 0) {
            cart[0] = [productId, productQuantity, productColor];
        } else {
            for (let i = 0; i < cart.length; i++) {
                if (cart[i][0] == productId) {
                    boolean = true;
                    if (cart[i].indexOf(productColor) !== -1) {
                        let j = cart[i].indexOf(productColor);
                        if (cart[i][j - 1] + productQuantity <= 100) {
                            cart[i][j - 1] += productQuantity;
                        } else {
                            alert("La quantité totale d'un article ne doit pas dépasser 100");
                            return;
                        }                        
                    } else {
                        cart[i].push(productQuantity, productColor);
                    }
                }
            }
            if (boolean == false) {
                cart[cart.length] = [productId, productQuantity, productColor];
            }  
        }
            
        localStorage.setItem("cart", JSON.stringify(cart));
        storedCart = JSON.parse(localStorage.getItem("cart"));
        alert("L'article a été ajouté au panier");
    }
}

let cartButton = document.getElementById("addToCart");
cartButton.addEventListener("click", fillCart);