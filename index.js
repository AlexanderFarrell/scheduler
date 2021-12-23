
let name = "Alex";
let message = `Hello your name is ${name}!`;

console.log(message);
let i = new Date().toDateString();

fetch('')
.then()



display("humidity", data.main.humidity, "Humidity")



function display(id, text, title) {
    let e = document.createElement("div");
    e.innerText = text;

    let container = document.getElementById(id);
    container.setAttribute("class", "weather_ele");
    container.innerHTML = `<h1>${title}</h1>`;
    container.appendChild(e);
}


