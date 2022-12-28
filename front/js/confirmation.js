const url = new URLSearchParams(window.location.search);
const orderId = new URLSearchParams(window.location.search).get("id");
const id_order = document.getElementById("orderId");
id_order.textContent = orderId;