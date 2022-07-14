//add server address
let HTTP_PORT = window.location.port || 8080;
let server_address = `http://localhost:${HTTP_PORT}/`;
document.getElementById("order_form").setAttribute("action",`${server_address}order_full/`);
function createEl(position, picture, cost, divImgContainer, divTextContainer ) {
    const image = document.createElement("img");
    image.classList.add("image_position");
    image.setAttribute("src", `pic/${picture}`);
    image.setAttribute("alt", `${position}`);
    divImgContainer.appendChild(image);

    const positionName = document.createElement("p");
    positionName.classList.add("position_name");
    positionName.textContent = `${position}`;
    divTextContainer.appendChild(positionName);

    const price = document.createElement("p");
    price.classList.add("price");
    price.textContent = `${cost} UAH`;
    divTextContainer.appendChild(price);
}
    
let xhr = new XMLHttpRequest();
xhr.open("GET", server_address + "order/", true);
xhr.send();

let order = document.querySelector(".order"); 
let totalPrise = document.querySelector(".total_price_number");

xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
        let response = JSON.parse(this.responseText);
        let data = response.data;
        for (let i = 0; i < data.length; i++){
            const orderPosition = document.createElement("div");
            orderPosition.classList.add("order_position");
            order.appendChild(orderPosition);

            const divImgContainer = document.createElement("div");
            divImgContainer.classList.add("img_container");
            orderPosition.appendChild(divImgContainer);

            const divTextContainer = document.createElement("div");
            divTextContainer.classList.add("text_container");
            orderPosition.appendChild(divTextContainer);

            const button = document.createElement("button");
            button.classList.add("btn", "remove_position");
            button.textContent = "x";
            divTextContainer.appendChild(button);
            button.addEventListener('click', () => removePosition(data[i].picture, orderPosition));

            createEl(data[i].position, data[i].picture, data[i].price, divImgContainer, divTextContainer );
            
            const input = document.createElement("input")
            input.setAttribute("type", "number");
            input.setAttribute("min", "1");
            input.value = data[i].amount;
            input.addEventListener('focusout', () => changeAmount(data[i].picture, input));
            divTextContainer.appendChild(input);
           
        } 
        updateTotalPrice()
    }
    if (xhr.status != 200) {
        console.log('error: ' + (xhr.status ? xhr.statusText : 'request failed'));
    }
}

function removePosition(pictureName, orderPosition){
    orderPosition.remove();
    updateTotalPrice()
    let xhr = new XMLHttpRequest();
    data = {
        picName : pictureName
        };
    xhr.open("POST", server_address + "del/", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == 4 && xhr.status == 200) {

            console.log(this.responseText);
        }
        if (this.status != 200) {
            console.log('error: request failed');
        }
    }
    xhr.send(JSON.stringify(data));
}

function changeAmount(pictureName, input){
    updateTotalPrice()
    let xhr = new XMLHttpRequest();
    data = {
        picName : pictureName,
        amount : input.value
        };
    xhr.open("POST", server_address + "update/", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == 4 && xhr.status == 200) {

            console.log(this.responseText);
        }
        if (this.status != 200) {
            console.log('error: request failed');
        }
    }
    xhr.send(JSON.stringify(data));
}
function updateTotalPrice(){
    let priceArray = [];
    document.querySelectorAll(".price").forEach(el => priceArray.push(parseInt(el.textContent.slice(0, -4))));
    let amountArray = [];
    document.querySelectorAll(".text_container > input").forEach(el => amountArray.push(el.value));
    let sum = 0;
    for(let i=0; i< priceArray.length; i++) {
        sum += priceArray[i]*amountArray[i];
    }
    return totalPrise.textContent = `${sum}`; 
}