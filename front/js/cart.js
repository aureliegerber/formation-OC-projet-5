let storedCart = JSON.parse(localStorage.getItem("cart"));
console.log(storedCart);
let cartItems = document.getElementById("cart__items");

fetch("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value) {        
        displayCart(value);
        modifyQuantity();
        deleteProduct();     
    })
    .catch(function(err) {
        console.log(err);
    });


/**
 * Display product details
 * @param {array}
 * @return {undefined}
 */

function displayCart(array) {
    for (let i = 0; i < array.length; i++) {
        let matchId = storedCart.indexOf(array[i]._id);        
        if (matchId !== -1) { // si un identifiant est trouvé dans le storedCart
            let j = 1;
            while (!isNaN(storedCart[matchId + j])) {
                cartItems.innerHTML += `
                <article class="cart__item" data-id="${array[i]._id}" data-color="${storedCart[matchId + j + 1]}">
                        <div class="cart__item__img">
                          <img src="${array[i].imageUrl}" alt="${array[i].altTxt}">
                        </div>
                        <div class="cart__item__content">
                          <div class="cart__item__content__description">
                            <h2>${array[i].name}</h2>
                            <p>${storedCart[matchId + j + 1]}</p>
                            <p>${array[i].price} €</p>
                          </div>
                          <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                              <p>Qté : </p>
                              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${storedCart[matchId + j]}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                              <p class="deleteItem">Supprimer</p>
                            </div>
                          </div>
                        </div>
                </article>`;
                j += 2;                
            }
        }
    }
}

/**
 * Modify the localstorage
 * @param none
 * @return {undefined}
 */

function modifyLocalStorage() {
  localStorage.clear();
  localStorage.setItem("cart", JSON.stringify(storedCart));
}

/**
 * Modify the quantity of a product and modify the localstorage
 * @param none
 * @return {undefined}
 */


function modifyQuantity() {
  let inputQuantity = document.querySelectorAll(".itemQuantity");
  console.log(inputQuantity);
  for (let i = 0; i < inputQuantity.length; i++) {
    inputQuantity[i].addEventListener("change", function(e) {
    let newQuantity = e.target.value;
    console.log(newQuantity);
    let article = inputQuantity[i].closest("article");
    let dataId = article.getAttribute("data-id");
    let dataColor = article.getAttribute("data-color");
    console.log(dataId);
    console.log(dataColor);
    console.log(storedCart);
    for (let j = 0; j < storedCart.length; j++) {
      if (storedCart[j] == dataId) {
        let k = 1;
        while (!isNaN(storedCart[j + k])) {
          if (storedCart[j + k + 1] == dataColor) {
            console.log("yes");
            storedCart[j + k] = newQuantity;
            console.log(storedCart);
          }
          k += 2;
        }        
      }
    }
    modifyLocalStorage();
    })
  }
}

/**
 * Remove a product from the cart and modify the DOM and the localstorage
 * @param none
 * @return {undefined}
 */

function deleteProduct() {
  let deleteClick = document.querySelectorAll(".deleteItem");
  console.log(deleteClick);  
  for (let i = 0; i < deleteClick.length; i++) {
    deleteClick[i].addEventListener("click", function(e) {
    let article = deleteClick[i].closest("article");
    let dataId = article.getAttribute("data-id");
    let dataColor = article.getAttribute("data-color");
    console.log(dataId);
    console.log(dataColor);
    console.log(storedCart);
    for (let j = 0; j < storedCart.length; j++) {         
      if (storedCart[j] == dataId) {
        let k = 1;
        while (!isNaN(storedCart[j + k])) {
          if (storedCart[j + k + 1] == dataColor) {
            console.log("yes");
            storedCart.splice(j + k, 2);
            article.remove();
            cleanCart(); 
            console.log(storedCart);                  
          }
          k += 2;          
        }              
      }
    }
    modifyLocalStorage();
    })    
  }
}

/**
 * Remove from the cart identifiers that have no quantity or color
 * @param none
 * @return {undefined}
 */

function cleanCart() {
  for (let i = 0; i < storedCart.length; i++) {
    if (storedCart[i].length > 10 && isNaN(storedCart[i + 1])) {
      storedCart.splice(i, 1);
    }
  }
}
