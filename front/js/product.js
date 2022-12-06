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
 * @return {HTMLElement}
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

let promise = fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value) {
        displayProduct(value);
                    
    })
    .catch(function(err) {
        console.log("error")
    });

let cart = [];
let storedCart = JSON.parse(localStorage.getItem("cart"));   
let cartButton = document.getElementById("addToCart");

/**
 * Fill the cart
 * @param none
 * @return {object}
 */

function fillCart() {
    if (storedCart !== null) {
        cart = storedCart;
    }
    let productQuantity = parseInt(document.getElementById("quantity").value);
    console.log(productQuantity);
    let productColor = document.getElementById("colors").value;
    console.log(productColor);
    if (cart.indexOf(productId) == -1) {
        cart.push(productId, productQuantity, productColor);
    } else {
        if (cart.indexOf(productColor) == -1) {
            cart.push(productQuantity, productColor)
        } else {
            cart[cart.indexOf(productColor) - 1] += productQuantity;
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    storedCart = JSON.parse(localStorage.getItem("cart"));
    document.location.reload();

    console.log(storedCart);

}

cartButton.addEventListener("click", fillCart);

