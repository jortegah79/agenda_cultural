document.addEventListener("load", init());

/**
 * Funcion de inicio del programa. De inicio carga todos los elementos y pone a la escucha el selector tanto del modo escritorio, como del modo hamburguesa
 * y deriva al metodo correspondiente en caso de actuacion de estos.
 */
function init() {

    const URL = "https://analisi.transparenciacatalunya.cat/resource/rhpv-yr4f.json";
    get_data(URL);
    document.getElementById("byTopic").addEventListener("click", (e) =>get_data(URL,e.target.textContent));
    document.getElementById("byTopic2").addEventListener("click", (e) =>get_data(URL,e.target.textContent));
}

/**
 * Funcion que gestiona los datos obtenidos desde la api rest
 * @param {*} url Url pasada como constante desde el metodo init
 * @param {*} tipo Pasado el tipo seleccionado por el usuario
 */
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

/**
 * Funcion para mostrar los elementos en pantalla.Inicialmente reiniciamos pantalla, si hay una seleccion de tipo, se hace un cribado
 * Por ultimo, se seleccionan solo los eventos no anteriores a los 2 meses pasados y los siguientes.
 * @param {*} data datos venidos desde la api rest.
 * @param {*} tipo tipo seleccionado por el usuario.
 */
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
          
            fragment.appendChild(genera_Card(el));
        }
    })        
    let resultado = document.getElementById("resultado");
    resultado.appendChild(fragment);

}
/**
 * Funcion para mostrar el mapa En caso de hacer doble click, tambien gestionamos su cierre.
 * @param {} evento Es el evento pasado desde el boton de la targeta correspondiente a un espectaculo.
 */
function muestra_mapa(evento) {
    let citiArray = evento['comarca_i_municipi'].split("/");

    let ciutat = citiArray[citiArray.length - 1]; 
    document.getElementById("map").classList.add("visible");
    let map = L.map('map').setView([evento.latitud, evento.longitud], 25);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    let marker = L.marker([evento.latitud, evento.longitud]).addTo(map);
    marker.bindPopup(`<h5>${evento['denominaci']}</h5><h6>${ciutat}
    </h6><p>${evento['adre_a']}</p>`).openPopup();

    var popup = L.popup()
    .setLatLng([evento.latitud,evento.longitud])
    .setContent(`
    <h4>${evento['denominaci']}</h4>
    <h5>${ciutat}</h5><h6>${evento['adre_a']}</h6>
    <p><b>Doble click</b> sobre el mapa per tancar</p>`)
    .openOn(map);

    document.getElementById("map").addEventListener("dblclick", () => {
        
        let div_map=document.getElementById("div-map");
        let map=document.getElementById("map");           
        div_map.removeChild(map);     
        let div=document.createElement("div");
        div.setAttribute("id","map");
        div.classList.add("m-auto","oculto"); 
        div_map.appendChild(div);
        
    })   
}

/**
 * Funcion realizada para reiniciar la vista principal
 */
function reinicia_lista(){
    let div_resultado=document.getElementById("resultado");
    let div=document.createElement("div");
    div.classList.add("row" , "mt-5" , "me-auto","ms-auto" );
    div.setAttribute("id","resultado");
    div_resultado.replaceWith(div);
    
}

/**
 * Funcion para mostrar una serie de fotos precargadas, para simular un servicio completo. No se pueden obtener las fotos desde esta api-rest.
 * @param {} tipo 
 * @returns 
 */
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

/**
 * Funcion para generar el elemento de tipo card con los datos, imagen y boton submit que envia a la ubicacion en el mapa.
 * @param {*} el los datos provenientes desde el array
 * @returns un div de tipo card.
 */
function genera_Card(el){
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
            return div_card;
}