let storedCart = JSON.parse(localStorage.getItem("cart"));
console.log(storedCart);
let cartItems = document.getElementById("cart__items");
let totalQuantitySpan = document.getElementById("totalQuantity");
let totalPriceSpan = document.getElementById("totalPrice");
let productsArray = [];
let titre1 = document.querySelector("h1");


fetch("http://localhost:3000/api/products")
    .then(function(res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function(value) {
      total();
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
    total();
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
      if (storedCart[i].length > 10) {
        await fetch("http://localhost:3000/api/products")
          .then(function(res) {
            if (res.ok) {
                return res.json();
            }
          })
          .then(function(value) {                
            for (let k = 0; k < value.length; k++) {
              if (value[k]._id == storedCart[i]) {
                let j = 1;                
                while(!isNaN(storedCart[i + j])) {
                  productTotalQuantity += parseInt(storedCart[i + j]);                                  
                  j += 2;
                }
                productTotalPrice = productTotalQuantity*(value[k].price);                        
              }              
            }            
          })
          .catch(function(err) {
              console.log(err);
          });
      }
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


/******************* QUESTION CLEMENT *************************/
/* function validInputForm(toListen, regExp) {
  toListen.addEventListener("change", function(e) {
    return regExp.test(e.target.value);
  })
}

function validForm() {
    if (validInputForm(firstName, regExpNameCity)) {
    firstNameErrorMsg.innerHTML = "";
  } else {
    firstNameErrorMsg.innerHTML = "Le prénom doit comporter au moins 2 lettres et ne pas contenir de chiffre";
  }

  if (validInputForm(lastName, regExpNameCity)) {
    lastNameErrorMsg.innerHTML = "";
  } else {
    lastNameErrorMsg.innerHTML = "Le nom doit comporter au moins 2 lettres et ne pas contenir de chiffre";
  }

  if (validInputForm(address, regExpAddress)) {
    addressErrorMsg.innerHTML = "";
  } else {
    addressErrorMsg.innerHTML = "L'adresse doit contenir au moins 5 caractères";
  }

  if (validInputForm(city, regExpNameCity)) {
    cityErrorMsg.innerHTML = "";
  } else {
    cityErrorMsg.innerHTML = "La ville doit comporter au moins 2 lettres et ne pas contenir de chiffre";
  }

  if (validInputForm(email, regExpEmail)) {
    emailErrorMsg.innerHTML = "";
  } else {
    emailErrorMsg.innerHTML = "Veuillez saisir un email valide";
  }
}

************** AUTRE IDEE ************

let boolean;

function validInputFirstName() {
  firstName.addEventListener("change", function(e) {
    boolean = regExpNameCity.test(e.target.value);
    return regExpNameCity.test(e.target.value);
  })
}

validInputFirstName();
console.log(boolean);


/******************* QUESTION CLEMENT *************************/

let validations = 0;

function firstNameIsValid() {
  firstName.addEventListener("change", function(e) {
    if(regExpNameCity.test(e.target.value)) {
      firstNameErrorMsg.innerHTML = "";
      validations += 1;
    } else {
      firstNameErrorMsg.innerHTML = "Le prénom doit comporter au moins 2 lettres et ne pas contenir de chiffre";      
    }
  })
}

firstNameIsValid();

function lastNameIsValid() {
  lastName.addEventListener("change", function(e) {
    if(regExpNameCity.test(e.target.value)) {
      lastNameErrorMsg.innerHTML = "";
      validations += 1;
    } else {
      lastNameErrorMsg.innerHTML = "Le nom doit comporter au moins 2 lettres et ne pas contenir de chiffre";
    }
  })
}

lastNameIsValid();


function addressIsValid() {
  address.addEventListener("change", function(e) {
    if(regExpAddress.test(e.target.value)) {
      addressErrorMsg.innerHTML = "";
      validations += 1;
    } else {
      addressErrorMsg.innerHTML = "L'adresse doit contenir au moins 5 caractères";
    }
  })
}

addressIsValid();

function cityIsValid() {
  city.addEventListener("change", function(e) {
    if(regExpNameCity.test(e.target.value)) {
      cityErrorMsg.innerHTML = "";
      validations += 1;
    } else {
      cityErrorMsg.innerHTML = "La ville doit comporter au moins 2 lettres et ne pas contenir de chiffre";
    }
  })
}

cityIsValid();

function emailIsValid() {
  email.addEventListener("change", function(e) {
    if(regExpEmail.test(e.target.value)) {
      emailErrorMsg.innerHTML = "";
      validations += 1;
    } else {
      emailErrorMsg.innerHTML = "Veuillez saisir un email valide";
    }
  })
}

emailIsValid();

let contact;

function createContact() {
  contact = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value
  }  
}



function command() {
  orderCommand.addEventListener("click", function(e) {
    e.preventDefault();
    if (storedCart == null) {
      titre1.innerHTML = "Votre panier est vide !"
    } else {
      if (validations == 5) {
        createContact();
        console.log(contact);
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

for (let item of storedCart) {
  if (item.length > 10) {
    productsArray.push(item);
  }  
}

console.log(productsArray);

