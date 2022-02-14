
function validate(){
    let a = document.forms["ingresarProd"]["title"].value
    let b = document.forms["ingresarProd"]["price"].value
    let c = document.forms["ingresarProd"]["thumbnail"].value
    let d = document.forms["ingresarProd"]["stock"].value
    if (a =="" || b=="" || c==""|| d=="" ){
        alert("Debe completar todos los datos");
        return false;
    }
}

function render(data) {
    const html = data.map((elem) => {
        return(`<div>
            <strong>${elem.author}</strong>
            <strong style="color: green;">${elem.date}</strong>:
            <em>${elem.text}</em> </div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
}

function renderLista(data) {
    const tabla = data.map(elem => {
        return(`<tr>
        <th scope="row">${elem.id}</th>
        <td>${elem.title}</td>
        <td>${elem.stock}</td>
        <td>${elem.price}</td>
        <td><img style="width:40px; height: auto" src=${elem.thumbnail}></td>
      </tr>`)
    }).join(" ");
    document.getElementById('tbody').innerHTML = tabla;
}


function addMessage(e) {
    let a = document.getElementById('username').value;
    if (a.includes("@")){
        const mensaje = {
            author: document.getElementById('username').value,
            date: fecha.toISOString(),
            text: document.getElementById('texto').value
        };
        socket.emit('new-message', mensaje);
        return false;
    }else(alert("Ingrese una dirección de e-mail válida"));
}


const socket = io.connect();
socket.on('messages', data => render(data));
socket.on('productos', data => renderLista(data));

const fecha = new Date;