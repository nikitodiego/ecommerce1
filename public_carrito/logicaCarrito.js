let products = [];
let total = 0;
let productList = [];


function add(productId, price) {
    const product = productList.find(p => p.id === productId);
    product.stock--;

    products.push(productId);
    total = total + price;
    document.getElementById("checkout").innerHTML = `Pagar $${total}`
    displayProducts();
}

function quitar(productId, price) {   
    if (products.includes(productId)){
        const product = productList.find(p => p.id === productId);
        product.stock++;
        products.pop(productId);
        total = total - price;
        document.getElementById("checkout").innerHTML = `Pagar $${total}`
        displayProducts();
    }
}

function displayProducts(){
    let productsHTML = '';
    productList.forEach(element => {
        let buttonHTML = `<button class="btn btn-primary" onclick="add(${element.id}, ${element.price})">Agregar</button>`;

        if (element.stock <= 0) {
            buttonHTML = `<button disabled class="btn btn-primary" onclick="add(${element.id}, ${element.price})">Sin stock</button>`;
        }
        productsHTML +=
        `<div class="card" style="width: 18rem; margin: 1rem; display: inline-block;">
            <img src=${element.thumbnail} class="card-img-top" alt="Imagen ilustrativa" style="width: 100%; height: auto">
            <div class="card-body" >
                <h5 class="card-title">${element.title}</h5>
                <p class="card-text">Precio:${element.price}</p>
                ${buttonHTML}
                <button class="btn btn-primary" onclick="quitar(${element.id}, ${element.price})">Quitar</button>
            </div>
        </div>`
    });
    document.getElementById('container').innerHTML = productsHTML;
}

async function crearCarrito() {
    if (total > 0) {
        const carrito = await (await fetch("/api/pay", {
            method: "post",
            body: JSON.stringify({ productos: products }),
            headers: { "Content-Type": "application/json" }
        })).json();
        alert("Compra exitosa");
    } else {
        alert("Debe cargar al menos un elemento para efectuar la compra")
    }
}

//Consumo la API con los productos
window.onload = async() => {
    productList = await (await fetch("/api/productos")).json();
    displayProducts();
}
