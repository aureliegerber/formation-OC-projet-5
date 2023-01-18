let storedCart = JSON.parse(localStorage.getItem("cart"));
const cartItems = document.getElementById("cart__items");
const totalQuantitySpan = document.getElementById("totalQuantity");
const totalPriceSpan = document.getElementById("totalPrice");
const productsArray = [];
let contact;

/**
 * Contact the API and start the displayCart, total, modifyQuantity and deleteProduct functions
 * @param {url}
 * @return {undefined}
 */

function getProduct() {  
  if (storedCart != null) {
    if (storedCart.length != 0) {
      fetch("http://localhost:3000/api/products")
          .then(function(res) {
            if (res.ok) {
              return res.json();
            }
          })
          .then(function(value) {
            displayCart(value);
            total(value);   
            modifyQuantity();
            deleteProduct();
          })
          .catch(function(err) {
            console.log(err);
          });
    }
  }
}

getProduct();


/**
 * Display the products of the localstorage in the page
 * @param {array} response - Response of the API
 * @param {string} array[]._id
 * @param {string} array[].imageUrl
 * @param {string} array[].altTxt
 * @param {string} array[].name
 * @param {number} array[].price
 * @return {undefined}
 */

function displayCart(array) {  
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < storedCart.length; j++) {
      if (storedCart[j][0] == array[i]._id) {  // if an identifier is found in the storedCart
        for (let k = 1; k <= (storedCart[j].length - 1)/2; k++) {
          cartItems.innerHTML += `
          <article class="cart__item" data-id="${array[i]._id}" data-color="${storedCart[j][2*k]}">
                  <div class="cart__item__img">
                    <img src="${array[i].imageUrl}" alt="${array[i].altTxt}">
                  </div>
                  <div class="cart__item__content">
                    <div class="cart__item__content__description">
                      <h2>${array[i].name}</h2>
                      <p>${storedCart[j][2*k]}</p>
                      <p>${array[i].price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                      <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${storedCart[j][2*k - 1]}">
                      </div>
                      <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                      </div>
                    </div>
                  </div>
          </article>`;
        }
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
 * Retrieve from the page the price of the item on which the event took place
 * @param {object} object onto which the event was dispatched
 * @return {number} price - price of the product
 */

function getEventPrice(e) {
  const stringOfPrice = e.parentElement.parentElement.parentElement.firstElementChild.lastElementChild.innerHTML;
  return parseInt(stringOfPrice);
}

/**
 * Modify the quantity of a product and modify the localstorage
 * @param none
 * @return {undefined}
 */

function modifyQuantity() {
  const inputQuantity = document.querySelectorAll(".itemQuantity");  
  for (let i = 0; i < inputQuantity.length; i++) {
    inputQuantity[i].addEventListener("change", function(e) {
      let totalQuantity = parseInt(document.getElementById("totalQuantity").innerHTML);
      let totalPrice = parseInt(document.getElementById("totalPrice").innerHTML);       
      const newQuantity = e.target.value;
      const article = inputQuantity[i].closest("article"); 
      const dataId = article.getAttribute("data-id");
      const dataColor = article.getAttribute("data-color");      
      const price = getEventPrice(e.target);      
      for (let j = 0; j < storedCart.length; j++) {
        if (storedCart[j][0] == dataId) {
          for (let k = 1; k <= (storedCart[j].length - 1)/2; k++) {
            if (storedCart[j][2*k] == dataColor) {
              if (newQuantity <= 100) {                
                totalQuantity = totalQuantity - parseInt(storedCart[j][2*k - 1]) + parseInt(newQuantity);                
                totalQuantitySpan.innerHTML = totalQuantity;
                totalPrice = totalPrice - storedCart[j][2*k - 1]*price + newQuantity*price;                
                totalPriceSpan.innerHTML = totalPrice;                
                storedCart[j][2*k - 1] = parseInt(newQuantity);
                modifyLocalStorage();                             
              } else {
                alert("La quantité totale d'un article ne doit pas dépasser 100");
                e.target.value = storedCart[j][2*k - 1];
              }
            }
          }
        }
      }
    })
  }  
}

/**
 * Remove a product from the cart and modify the DOM and the localstorage
 * @param none
 * @return {undefined}
 */

function deleteProduct() {
  const deleteClick = document.querySelectorAll(".deleteItem");  
  for (let i = 0; i < deleteClick.length; i++) {
    deleteClick[i].addEventListener("click", function(e) {      
      let totalQuantity = parseInt(document.getElementById("totalQuantity").innerHTML);
      let totalPrice = parseInt(document.getElementById("totalPrice").innerHTML);
      const price = getEventPrice(e.target);        
      const article = deleteClick[i].closest("article");
      const dataId = article.getAttribute("data-id");
      const dataColor = article.getAttribute("data-color");    
      for (let j = 0; j < storedCart.length; j++) {         
        if (storedCart[j][0] == dataId) {
          for (let k = 1; k <= (storedCart[j].length - 1)/2; k++) {
            if (storedCart[j][2*k] == dataColor) {
              totalQuantity = parseInt(totalQuantity - storedCart[j][2*k - 1]);
              totalQuantitySpan.innerHTML = totalQuantity;
              totalPrice = totalPrice - storedCart[j][2*k - 1]*price;
              totalPriceSpan.innerHTML = totalPrice;
              storedCart[j].splice(2*k - 1, 2);                            
              article.remove();              
            }
          }
        }
      }
      cleanCart();
      modifyLocalStorage();              
    })    
  }
}

/**
 * Remove from the cart identifiers that have no quantity/color
 * @param none
 * @return {undefined}
 */

function cleanCart() {
  for (let i = 0; i < storedCart.length; i++) {
    if (storedCart[i].length == 1) {
      storedCart.splice(i, 1);
    }
  }
  if (storedCart.length == 0) {
    location.reload();
  }
}

/**
 * Calculate total quantity and total price and display in the DOM
 * @param none
 * @return {undefined}
 */

function total(value) {
  let totalQuantity = 0;
  let totalPrice = 0;
  for (let i = 0; i < storedCart.length; i++) {
    let productTotalQuantity = 0;
    let productTotalPrice = 0;
    for (let j = 0; j < value.length; j++) {
      if (value[j]._id == storedCart[i][0]) {
        for (let k = 1; k <= (storedCart[i].length - 1)/2; k++) {
          productTotalQuantity += parseInt(storedCart[i][2*k - 1]);                                   
        }         
        productTotalPrice = productTotalQuantity*(value[j].price);                                      
      }              
    }            
    totalQuantity += productTotalQuantity;                         
    totalPrice += productTotalPrice;              
    totalQuantitySpan.innerHTML = totalQuantity;
    totalPriceSpan.innerHTML = totalPrice;
  }  
}

const firstName = document.getElementById("firstName");
const lastName = document.getElementById("lastName");
const address = document.getElementById("address");
const city = document.getElementById("city");
const email = document.getElementById("email");
const orderCommand = document.getElementById("order");
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const emailErrorMsg = document.getElementById("emailErrorMsg");

const regExpNameCity = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð'-]{2,40}$/;
const regExpAddress = /[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð0-9 ,.'-]{5,50}$/;
const regExpEmail = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9-_]+[.]{1}[a-z]{2,10}$/;

let inputForm1 = 0;
let inputForm2 = 0;
let inputForm3 = 0;
let inputForm4 = 0;
let inputForm5 = 0;

/**
 * Check if the first name is valid and display an error message in the DOM if not
 * @param none
 * @return {undefined}
 */

function firstNameIsValid() {
  firstName.addEventListener("change", function(e) {
    if(regExpNameCity.test(e.target.value)) {
      firstNameErrorMsg.innerHTML = "";
      inputForm1 = 1;
    } else {
      firstNameErrorMsg.innerHTML = "Le prénom doit comporter au moins 2 lettres et ne pas contenir de chiffre";
      inputForm1 = 0;     
    }    
  })
}

firstNameIsValid();

/**
 * Check if the last name is valid and display an error message in the DOM if not
 * @param none
 * @return {undefined}
 */

function lastNameIsValid() {
  lastName.addEventListener("change", function(e) {
    if(regExpNameCity.test(e.target.value)) {
      lastNameErrorMsg.innerHTML = "";
      inputForm2 = 1;
    } else {
      lastNameErrorMsg.innerHTML = "Le nom doit comporter au moins 2 lettres et ne pas contenir de chiffre";
      inputForm2 = 0;  
    }    
  })
}

lastNameIsValid();

/**
 * Check if the address is valid and display an error message in the DOM if not
 * @param none
 * @return {undefined}
 */

function addressIsValid() {
  address.addEventListener("change", function(e) {
    if(regExpAddress.test(e.target.value)) {
      addressErrorMsg.innerHTML = "";
      inputForm3 = 1;
    } else {
      addressErrorMsg.innerHTML = "L'adresse doit contenir au moins 5 caractères";
      inputForm3 = 0;  
    }    
  })
}

addressIsValid();

/**
 * Check if the city is valid and display an error message in the DOM if not
 * @param none
 * @return {undefined}
 */

function cityIsValid() {
  city.addEventListener("change", function(e) {
    if(regExpNameCity.test(e.target.value)) {
      cityErrorMsg.innerHTML = "";
      inputForm4 = 1;
    } else {
      cityErrorMsg.innerHTML = "La ville doit comporter au moins 2 lettres et ne pas contenir de chiffre";
      inputForm4 = 0;
    }    
  })
}

cityIsValid();

/**
 * Check if the email is valid and display an error message in the DOM if not
 * @param none
 * @return {undefined}
 */

function emailIsValid() {
  email.addEventListener("change", function(e) {
    if(regExpEmail.test(e.target.value)) {
      emailErrorMsg.innerHTML = "";
      inputForm5 = 1;
    } else {
      emailErrorMsg.innerHTML = "Veuillez saisir un email valide";
      inputForm5 = 0;  
    }    
  })
}

emailIsValid();

/**
 * Create a contact object
 * @param none
 * @return {undefined}
 */

function createContact() {
  contact = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value
  }  
}

/**
 * Create an array of products
 * @param none
 * @return {undefined}
 */

function createProductsArray() {
  for (let item of storedCart) {
    productsArray.push(item[0]);
  }
}

/**
 * Make a post request on the API
 * Retrieve the command ID
 * Redirect the user to the confirmation page by passing the order id in the url
 * @param none
 * @return {undefined}
 */

function command() {
  orderCommand.addEventListener("click", function(e) {
    e.preventDefault();
    if (storedCart != null && storedCart.length != 0) {
      if (inputForm1*inputForm2*inputForm3*inputForm4*inputForm5 == 1) {      
        createContact();
        createProductsArray();      
        const init = {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contact: contact,
            products: productsArray,
          })
        }
        fetch("http://localhost:3000/api/products/order", init)
          .then(function(res) {
            if (res.ok) {
              return res.json();
            }
          })
          .then(function(value) {
            localStorage.clear();
            window.location.assign("confirmation.html?id=" + value.orderId);
          })
          .catch(function(err) {
            console.log(err);
          })     
      } else {
        alert("Veuillez remplir correctement le formulaire")
      }      
    } else {
      alert("Votre panier est vide");
    }
  })
}

command();