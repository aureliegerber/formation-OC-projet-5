let storedCart = JSON.parse(localStorage.getItem("cart"));
let cartItems = document.getElementById("cart__items");
let totalQuantitySpan = document.getElementById("totalQuantity");
let totalPriceSpan = document.getElementById("totalPrice");
let productsArray = [];
let titre1 = document.querySelector("h1");

/**
 * Contact the API and start the total, displayCart, modifyQuantity and deleteProduct functions
 * @param {url}
 * @return {undefined}
 */

fetch("http://localhost:3000/api/products")
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {
      if (storedCart == null) {
        titre1.innerHTML = "Votre panier est vide !";
        total();
    } else {      
      displayCart(value);
      modifyQuantity();
      deleteProduct();
      total();
    }
    })
    .catch(function(err) {
        console.log(err);
    });


/**
 * Display the product details in the DOM
 * @param {array}
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
 * Modify the quantity of a product and modify the localstorage
 * @param none
 * @return {undefined}
 */


function modifyQuantity() {
  let inputQuantity = document.querySelectorAll(".itemQuantity");  
  for (let i = 0; i < inputQuantity.length; i++) {
    inputQuantity[i].addEventListener("change", function(e) {
    let newQuantity = e.target.value;    
    let article = inputQuantity[i].closest("article");
    let dataId = article.getAttribute("data-id");
    let dataColor = article.getAttribute("data-color");    
    for (let j = 0; j < storedCart.length; j++) {
      if (storedCart[j][0] == dataId) {
        for (let k = 1; k <= (storedCart[j].length - 1)/2; k++) {
          if (storedCart[j][2*k] == dataColor) {
            storedCart[j][2*k - 1] = newQuantity;
          }
        }
      }
    }
    modifyLocalStorage();
    total();
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
  for (let i = 0; i < deleteClick.length; i++) {
    deleteClick[i].addEventListener("click", function(e) {
      let article = deleteClick[i].closest("article");
      let dataId = article.getAttribute("data-id");
      let dataColor = article.getAttribute("data-color");    
      for (let j = 0; j < storedCart.length; j++) {         
        if (storedCart[j][0] == dataId) {
          for (let k = 1; k <= (storedCart[j].length - 1)/2; k++) {
            if (storedCart[j][2*k] == dataColor) {
              storedCart[j].splice(2*k - 1, 2);
              article.remove();              
            }
          }
        }
      }
      cleanCart();
      modifyLocalStorage();      
      total();
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
}


/**
 * Calculate total quantity and total price and display in the DOM
 * @param none
 * @return {undefined}
 */

async function total() {
  let totalQuantity = 0;
  let totalPrice = 0;
  if (storedCart == null) {
    totalQuantitySpan.innerHTML = 0;
    totalPriceSpan.innerHTML = 0;
  } else {
    for (let i = 0; i < storedCart.length; i++) {
      let productTotalQuantity = 0;
      let productTotalPrice = 0;
      await fetch("http://localhost:3000/api/products")
          .then(function(res) {
            if (res.ok) {
                return res.json();
            }
          })
          .then(function(value) {                
            for (let j = 0; j < value.length; j++) {
              if (value[j]._id == storedCart[i][0]) {
                for (let k = 1; k <= (storedCart[i].length - 1)/2; k++) {
                  productTotalQuantity += parseInt(storedCart[i][2*k - 1]);
                  console.log(productTotalQuantity);                  
                };                
                productTotalPrice = productTotalQuantity*(value[j].price);
                console.log(productTotalPrice);                       
              }              
            }            
          })
          .catch(function(err) {
            console.log(err);
          });

          totalQuantity += productTotalQuantity;                         
          totalPrice += productTotalPrice;              
          totalQuantitySpan.innerHTML = totalQuantity;
          totalPriceSpan.innerHTML = totalPrice;
      }  
  }
}
  
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let address = document.getElementById("address");
let city = document.getElementById("city");
let email = document.getElementById("email");
let orderCommand = document.getElementById("order");
let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
let addressErrorMsg = document.getElementById("addressErrorMsg");
let cityErrorMsg = document.getElementById("cityErrorMsg");
let emailErrorMsg = document.getElementById("emailErrorMsg");

const regExpNameCity = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,40}$/;
const regExpAddress = /[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð0-9 ,.'-]{5,50}$/;
const regExpEmail = /^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/;

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

let contact;

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
 * Make a post request on the API
 * Retrieve the command ID
 * Redirect the user to the confirmation page by passing the order id in the url
 * @param none
 * @return {undefined}
 */

function command() {
  orderCommand.addEventListener("click", function(e) {
    e.preventDefault();
    if (storedCart == null) {
      titre1.innerHTML = "Votre panier est vide !"
    } else {
      for (let item of storedCart) {
        if (item.length > 10) {
          productsArray.push(item);
        }  
      }
      if (inputForm1*inputForm2*inputForm3*inputForm4*inputForm5 == 1) {
        createContact();        
        let init = {
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
      }
    }
  })
}

command();

