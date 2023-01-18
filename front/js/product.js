const url = new URLSearchParams(window.location.search);
const productId = url.get("id");
const itemImg = document.querySelector(".item__img");
const itemContentTitle = document.getElementById("title");
const itemContentPrice = document.getElementById("price");
const itemContentDescription = document.getElementById("description");
const itemContentSettingsColor = document.getElementById("colors");
let cart = [];
let storedCart = JSON.parse(localStorage.getItem("cart"));
const cartButton = document.getElementById("addToCart");

/**
 * Display product details
 * @param {object} response - Response of the API
 * @param {string} object._id
 * @param {string} object.imageUrl
 * @param {string} object.altTxt
 * @param {string} object.name
 * @param {number} object.price
 * @param {string} object.description
 * @param {array} object.color
 * @return {undefined}
 */

function displayProduct(object) {
    itemImg.innerHTML = `<img src="${object.imageUrl}" alt="${object.altTxt}">`;
    itemContentTitle.textContent = object.name;
    itemContentPrice.textContent = object.price;
    itemContentDescription.textContent = object.description;
    for (let i = 0; i < object.colors.length; i++) {
        itemContentSettingsColor.innerHTML += `
        <option value="${object.colors[i]}">${object.colors[i]}</option>`
    }  
}

/**
 * Retrieve data from the api from one product and call the displayProduct function
 * @param {string} url - Url of the API
 * @return {undefined}
 */

fetch(`http://localhost:3000/api/products/${productId}`)
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

/**
 * Check that the color and quantity between 1 and 100 have been chosen
 * @param {string} color
 * @param {number} quantity
 * @return {undefined}
 */

function checkInput(color, quantity) {
    if (color == "" && quantity == 0) {
        alert("Choisir une couleur et saisir une quantité");
    }
    if (color == "" && quantity != 0) {
        alert("Choisir une couleur");
    }
    if (color != "" && quantity == 0) {
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
    if (storedCart != null) {
        cart = storedCart;
    }

    let productQuantity = parseInt(document.getElementById("quantity").value);
    let productColor = document.getElementById("colors").value;
    let boolean = false;

    checkInput(productColor, productQuantity);    
    
    if (productColor != "" && productQuantity > 0 && productQuantity <= 100) {
        if (cart.length == 0) {
            cart[0] = [productId, productQuantity, productColor];
        } else {
            for (let i = 0; i < cart.length; i++) {
                if (cart[i][0] == productId) {
                    boolean = true;
                    if (cart[i].indexOf(productColor) != -1) {
                        let j = cart[i].indexOf(productColor);
                        if (cart[i][j - 1] + parseInt(productQuantity) <= 100) {
                            cart[i][j - 1] += parseInt(productQuantity);
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

cartButton.addEventListener("click", fillCart);