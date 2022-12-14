let storedCart = JSON.parse(localStorage.getItem("cart"));
console.log(storedCart);
let cartItems = document.getElementById("cart__items");
let totalQuantitySpan = document.getElementById("totalQuantity");
let totalPriceSpan = document.getElementById("totalPrice");
let productsArray;


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


function validInputForm(toListen, regExp) {
  toListen.addEventListener("change", function(e) {
    console.log(regExp.test(e.target.value));
    return regExp.test(e.target.value);
  })
}

let firstNameIsValid = validInputForm(firstName, regExpNameCity);
let lastNameIsValid = validInputForm(lastName, regExpNameCity);
let cityIsValid = validInputForm(city, regExpNameCity);
let addressIsValid = validInputForm(address, regExpAddress);

function validForm() {
  console.log(firstNameIsValid);
  if (firstNameIsValid) {
    firstNameErrorMsg.innerHTML = "Le prénom doit comporter au moins 2 lettres et ne pas contenir de chiffre";
  }
  if (lastNameIsValid) {
    lastNameErrorMsg.innerHTML = "Le nom doit comporter au moins 2 lettres et ne pas contenir de chiffre";
  }
  if (cityIsValid) {
    cityErrorMsg.innerHTML = "Le nom doit comporter au moins 2 lettres et ne pas contenir de chiffre";
  }
  if (addressIsValid) {
    addressErrorMsg.innerHTML = "L'adresse doit contenir au moins 5 caractères";
  } 
}


function createContact() {
  let contact = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value
  };
  console.log(contact);
}

function command() {
  orderCommand.addEventListener("click", function(e) {
    
    validForm();    
  });
}

command();



