document.addEventListener("load", init());


function init() {

    const URL = "https://analisi.transparenciacatalunya.cat/resource/rhpv-yr4f.json";
    get_data(URL);
    let select = document.getElementById("byTopic").addEventListener("click", (e) => {
        let tipo = e.target.textContent;
        get_data(URL, tipo);

    });


}

function get_data(url, tipo = "") {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === xhr.DONE || xhr.status === 200) {
            let data=JSON.parse(xhr.responseText);
            show_data(data, tipo);

        }
    })
    xhr.open("get", url);
    xhr.send();
}

//Esto para los proximos
function show_data(data, tipo) {
    reinicia_lista();
    const categoria=document.getElementById("categoria");
    categoria.textContent=" "+tipo.toUpperCase();
    let fragment = document.createDocumentFragment();
    let array = Array.from(data).filter(el => el['subt_tol'] !== undefined);
    
    array= array.sort((a, b) => Date.parse(b['data_inici']) - Date.parse(a['data_inici']));
    array = Array.from(array).filter(el=>el['subt_tol'].includes(tipo));
  
    array.forEach((el, i) => {

        if (new Date(el['data_inici']).getFullYear() < (new Date().getFullYear()) + 2 && new Date(el['data_inici']).getMonth() >= (new Date().getMonth()-2)) {

            let link = document.createElement("a");
            link.href = "#";
            link.classList.add("btn", "btn-info","mb-3");
            link.textContent = "Más info";
            link.addEventListener("click", (e) => muestra_mapa(el));

            let price = document.createElement("p");
            price.classList.add("card-text");
            price.textContent = el['entrades'];

            let desc = document.createElement("p");
            desc.classList.add("card-text");
            desc.innerHTML = el['descripcio'] == undefined ? "" : el['descripcio'].slice(0, 200);


            let subti = document.createElement("H5");
            subti.classList.add("card-title");
            subti.textContent = `${el['horari'] == undefined ? "" : el['horari'] + " -"}  ${new Date(el['data_inici']).toLocaleDateString()}`;

            let title = document.createElement("H3");
            title.classList.add("card-title");
            title.textContent = el['denominaci'];

            let div_card_body = document.createElement("div");
            div_card_body.appendChild(title);
            div_card_body.appendChild(subti);
            div_card_body.appendChild(desc);
            div_card_body.appendChild(price);
            div_card_body.appendChild(link);

            let img = document.createElement("img");
            img.classList.add("card-img-top");
            img.src = imagen_aleatoria(el['subt_tol']);
            img.alt = el['denominaci'];

            let div_card = document.createElement("div");
            div_card.classList.add("card", "border-light", "bg-secondary",  "col-10", "col-md-5", "col-lg-3", "text-center", "text-light");
           
            div_card.appendChild(img);
            div_card.appendChild(div_card_body);

            fragment.appendChild(div_card);
        }
    })

    let resultado = document.getElementById("resultado");
    resultado.appendChild(fragment);

}

function muestra_mapa(evento) {
    let citiArray = evento['comarca_i_municipi'].split("/");

    let ciutat = citiArray[citiArray.length - 1]; console.log(ciutat)
    document.getElementById("map").classList.add("visible");
    let map = L.map('map').setView([evento.latitud, evento.longitud], 25);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let marker = L.marker([evento.latitud, evento.longitud]).addTo(map);
    marker.bindPopup(`<h5>${evento['denominaci']}</h5><h6>${ciutat}
    </h6><p>${evento['adre_a']}</p>`).openPopup();
    document.getElementById("map").addEventListener("dblclick", () => {

        document.getElementById("map").classList.remove("visible");
        location.reload();
    })   
}
function reinicia_lista(){
    let div_resultado=document.getElementById("resultado");
    let div=document.createElement("div");
    div.classList.add("row" , "mt-5" , "me-auto","ms-auto" );
    div.setAttribute("id","resultado");
    div_resultado.replaceWith(div);
    
}
function imagen_aleatoria(tipo) {
     let array=['Concert','Espectacle','Familiar','Festival','Mostra','Patrimoni','Teatre'];
     let index=array.findIndex(el=>{
        if(tipo==undefined)return -1;
        return tipo.includes(el);
    });
    let num=Math.ceil(Math.random() * 4);
    let name=index==-1?"NO_FOTO"+num+".jpg":array[index]+num+".jpg";

       return `./img/${name}`;
}


/******************************************************************Esto es para fleatJS */
//var map = L.map('map').setView([40.711172,0.577423], 18);


/*var marker = L.marker([40.711172,0.577423]).addTo(map);
/*

var circle = L.circle([51.508, -0.11], {
    color: "#333",
    fillColor: '#6699dd',
    fillOpacity: 0.6,
    radius: 800
}).addTo(map);

var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

marker.bindPopup("<b>Hello world!The ninja programmer again!</b><br>I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");



var popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(map);


    function onMapClick(e) {
        alert("You clicked the map at " + e.latlng);
    }
    
    map.on('click', onMapClick);

    var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);
    */