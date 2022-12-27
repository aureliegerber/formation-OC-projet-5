let url = new URLSearchParams(window.location.search);
let productId = url.get("id");
let itemImg = document.querySelector(".item__img");
let itemContentTitle = document.getElementById("title");
let itemContentPrice = document.getElementById("price");
let itemContentDescription = document.getElementById("description");
let itemContentSettingsColor = document.getElementById("colors");

/**
 * Display product details
 * @param {array}
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
 * @param {url}
 * @return {promise}
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
                        cart[i][j - 1] += productQuantity;
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