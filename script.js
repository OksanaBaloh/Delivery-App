//add shops
const shops = document.getElementById("shops");  
let xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:8080/all/", true);
xhr.send();
xhr.onreadystatechange = function () {
    if (this.readyState == 4) {
        let response = JSON.parse(this.responseText);
        let data = response.data;
        
        for (let i = 0; i < data.length; i++){
            if (data[i].name === "sqlite_sequence"){
                continue;
            }
            const button = document.createElement("button");
            button.classList.add("btn", "btn_shop_name");
            button.textContent = `${data[i].name}`;
            shops.appendChild(button);
            button.addEventListener('click', () => showMenu(data[i].name));
        }        
    }
    if (this.status != 200) {
        console.log('error: ' + (this.status ? this.statusText : 'request failed'));
    }
}

//create elements( position, picture, price)
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
function updateMenu(data){
    const menu = document.getElementById("menu"); 
    for (let i = 0; i < data.length; i++){
        const divMenuPosition = document.createElement("div");
        divMenuPosition.classList.add("menu_position");
        menu.appendChild(divMenuPosition);

        const divImgContainer = document.createElement("div");
        divImgContainer.classList.add("img_container");
        divMenuPosition.appendChild(divImgContainer);
        
        const divTextContainer = document.createElement("div");
        divTextContainer.classList.add("text_container");
        divMenuPosition.appendChild(divTextContainer);

        createEl(data[i].position, data[i].picture, data[i].price, divImgContainer, divTextContainer);
    
        const button = document.createElement("button")
        button.classList.add("btn", "btn_add");
        button.textContent = "add to Cart";
        divMenuPosition.appendChild(button);
        button.addEventListener('click', () => addToCart(data[i].position, data[i].picture, data[i].price));
    }
}
//click on shop
function showMenu(restaurantName){
    document.querySelectorAll(".menu_position").forEach(el => el.remove());
    
    let xhr = new XMLHttpRequest();
    resName = {
        name : restaurantName
    };
    xhr.open("POST", "http://localhost:8080/res/", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {//Call a function when the state changes.
        if(xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText);
            let data = response.data;
            updateMenu(data);
        }
        if (this.status != 200) {
            console.log('error: ' + (this.status ? this.statusText : 'request failed'));
        }
    }
    xhr.send(JSON.stringify(resName));
}
//click on add
function addToCart(pos, pic, cost){
    
    let xhr = new XMLHttpRequest();
    data = {
          position : pos,
          picture : pic,
          price : cost
        };
    xhr.open("POST", "http://localhost:8080/post/", true);
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

