/**
 * Elemento para obtener los datos del formulario f_inicial
 * @type {Element}
 */
const fInicial = document.querySelector("#f_inicial");
/**
 * Elemento para obtener los datos del formulario f_auto 
 * @type {Element}
 */
const fAuto = document.querySelector("#f_auto");
/**
 * Botón para estacionar un auto 
 * @type {Element}
 */
const estacionar = document.querySelector("#estacionar");
/**
 * Botón para detener la ejecución del agente 
 * @type {Element}
 */
const detener = document.querySelector("#detener");
/**
 * Elemento donde se van agregar los cajones del estacionamiento 
 * @type {Element}
 */
const estacionamiento = document.querySelector("#estacionamiento");
/**
 * Elemento para mostrar cuantos lugares quedan disponibles 
 * @type {Element}
 */
const mensajeLugares = document.querySelector("#lug_disp");
/**
 * Contiene cada uno de los cajones 
 * @type {Element}
 */
const lugares = [];
/**
 * Variable para llevar el control de cuantos lugares disponibles hay 
 * @type {Number}
 */
let lugaresDisponibles;
/**
 * Botón para sacar auto
 * @type {Element}
 */
const sacarAuto = document.querySelector("#sacar_auto");

/**
 * Crea una alerta con un mensaje 
 * @param  {Number} mensaje Mensaje que mostrará la alerta
 * @param  {Number} tipo Tipo de alerta 
 * @return {Element} la alerta creada    
 */
const creaAlerta = (mensaje, tipo) => {
    /**
     * Alerta donde se mostrará el mensaje 
     * @type {Element}
     */
    let alerta = document.createElement("div");
    alerta.setAttribute("role", "alert");
    alerta.classList.add("alert", tipo, "fade-out");
    alerta.innerHTML = mensaje;
    return alerta;
}

fInicial.addEventListener('submit', (e) => {
    e.preventDefault();
    /**
     * Numero de pisos que ingresa el usuario desde el formulario 
     * @type {Number}
     */
    const noPisos = document.querySelector('[name="no_pisos"]').value;
    /**
     * Numero de cajones que ingresa el usuario desde el formulario 
     * @type {Number}
     */
    const noCajones = document.querySelector('[name="no_cajones"]').value;
    /**
     * Entrada con el número del auto
     * @type {Element}
     */
    const idAuto = document.querySelector("#no_auto");

    //Vacia todos los lugares disponibles en el estacionamiento
    while (lugares.length > 0) {
        lugares.pop();
    }
    //Habilita botones de control
    estacionar.removeAttribute("disabled");
    sacarAuto.removeAttribute("disabled");
    estacionamiento.replaceChildren();

    let row, col;
    //Crea y dibuja el estacionamiento.
    for (let i = 0; i < noPisos; i++) {
        row = document.createElement("div");
        row.className = "row";
        estacionamiento.appendChild(row);
        for (let j = 1; j <= noCajones; j++) {
            col = document.createElement("div");
            col.className = "col bg-success m-2 p-2 text-center fs-3 fw-bold text-white";
            col.innerText = j + i * noCajones;
            row.appendChild(col);
            lugares.push(col);
        }
    }
    //Crea limite para los autos que se pueden sacar 
    idAuto.setAttribute("max", lugares.length);
    //Inicia los lugares disponibles
    lugaresDisponibles = lugares.length;
    mensajeLugares.innerText = `Hay ${lugaresDisponibles} lugares disponibles`;
});

detener.addEventListener('click', () => {
    //Desabilita los botones de control 
    estacionar.setAttribute("disabled", "");
    sacarAuto.setAttribute("disabled", "");
});

//Cada que enviamos un número de auto para sacar 
fAuto.addEventListener('submit', (e) => {
    let alerta;
    e.preventDefault();
    /**
     * Id del auto que se desea sacar
     * @type {Number}
     */
    const noAuto = document.querySelector('[name="no_auto"]').value;
    //Si en el lugar no hay ningún auto, generas una alerta y la muestras por 1 segundo.
    if (lugares[noAuto - 1].classList.contains("bg-success")) {
        alerta = creaAlerta(`No hay ningun auto en el lugar ${noAuto}`, "alert-danger");
        estacionamiento.insertAdjacentElement("afterend", alerta);
        setTimeout(() => {
            alerta.remove();
        }, 1000);
    } else { //Cambia el estado del cajón a desocupado e incrementa la cantidad de lugares disponibles
        lugares[noAuto - 1].classList.remove("bg-danger");
        lugares[noAuto - 1].classList.add("bg-success");
        lugaresDisponibles++;
        alerta = creaAlerta("Auto sacado con éxito", "alert-success");
        estacionamiento.insertAdjacentElement("afterend", alerta);
        setTimeout(() => {
            alerta.remove();
        }, 1000);
        mensajeLugares.innerText = `Hay ${lugaresDisponibles} lugares disponibles`;
    }
});

estacionar.addEventListener('click', () => {
    let alerta;
    let estacionado = false;
    //Busca un lugar disponible y estaciona el auto si es posible 
    for (let i = lugares.length - 1; i >= 0; i--) {
        if (lugares[i].classList.contains("bg-success") && lugaresDisponibles > 0) {
            //Cambia el estado a ocupado 
            lugares[i].classList.remove("bg-success");
            lugares[i].classList.add("bg-danger");
            //Muestra alerta por 1 segundo
            alerta = creaAlerta("Auto estacionado exitosamente", "alert-success");
            estacionamiento.insertAdjacentElement("afterend", alerta);
            setTimeout(() => {
                alerta.remove();
            }, 1000);
            estacionado = true;
            lugaresDisponibles--;
            mensajeLugares.innerText = `Hay ${lugaresDisponibles} lugares disponibles`;
            break;
        }
    }
    //Verifica si el auto se pudo estacionar en algún lugar disponible, sino alerta al usuario.
    if (!estacionado) {
        alerta = creaAlerta("No hay más lugares disponibles", "alert-danger");
        estacionamiento.insertAdjacentElement("afterend", alerta);
        setTimeout(() => {
            alerta.remove();
        }, 1000);
    }
});
