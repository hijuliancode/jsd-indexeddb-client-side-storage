let DB;

// Selectores de la interfaz
const form = document.querySelector('#form'),
      nombreMascota = document.querySelector('#mascota'),
      nombreCliente = document.querySelector('#cliente'),
      telefono = document.querySelector('#telefono'),
      fecha = document.querySelector('#fecha'),
      hora = document.querySelector('#hora'),
      sintomas = document.querySelector('#sintomas'),
      citasListado = document.querySelector('#citas'),
      heading = document.querySelector('#administra')

// Event Listeners

document.addEventListener('DOMContentLoaded', () => { // IndexDB requiere que el DOM este listo
  // Crear la base de datos, nombre, versión, en la versión siempre deben haber números enteros
  let crearDB = window.indexedDB.open('citas', 1)

  // Si hay un error enviarlo a la consola
  crearDB.onerror = () => console.error('Hubo un error');

  // Si todo esta bien, mostrar en consola y asignar la base de datos
  crearDB.onsuccess = () => {
    DB = crearDB.result
    mostrarCitas()
  }

  // Este método solo corre una vez y es ideal para crear el Schema de la DB

  crearDB.onupgradeneeded = (e) => {
    // El evento es la misma base de datos
    let db = e.target.result
    
    // Definir el objectstore, toma 2 parametros, el nombre de la db y las opciones
    // Keypath es el key de la base de datos, autoIncrement, incrementara ese key cada vez que reciba un nuevo registro
    let objectStore = db.createObjectStore('citas', {
      keypath: 'key',
      autoIncrement: true
    })

    // Crear los indices y campos de la base de datos, createIndex: 3 parametros, nombre, keypath y opciones
    objectStore.createIndex('mascota', 'mascota', { unique: false })
    objectStore.createIndex('cliente', 'cliente', { unique: false })
    objectStore.createIndex('telefono', 'telefono', { unique: false })
    objectStore.createIndex('fecha', 'fecha', { unique: false })
    objectStore.createIndex('hora', 'hora', { unique: false })
    objectStore.createIndex('sintomas', 'sintomas', { unique: false })

    console.info('Base de datos creada y lista!', db);

  }

})

form.addEventListener('submit', agregarDatos)

// Agregar datos cuando el formulario se envía
function agregarDatos(e) {
  e.preventDefault()
  const nuevaCita =  {
    mascota : nombreMascota.value,
    cliente : nombreCliente.value,
    telefono : telefono.value,
    fecha : fecha.value,
    hora : hora.value,
    sintomas : sintomas.value
  }

  // En indexedDB se utilizan las transacciones
  let transaction = DB.transaction(['citas'], 'readwrite') // 2 modos, readonly o readwrite
  let objectStore = transaction.objectStore('citas') // ObjectStore me permite trabajar con la Db, aquí lo utilizamos para insertar los datos en la DB

  let peticion = objectStore.add(nuevaCita)

  peticion.onsuccess = () => {
    form.reset()
  }

  transaction.oncomplete = () => {
    mostrarCitas()
  }
  transaction.onerror = () => console.error('Hubo un error al agregar los datos')

}

function mostrarCitas() {
  // Limpiar citas anteriores
  while(citasListado.firstChild) {
    citasListado.removeChild(citasListado.firstChild)
  }

  // creamos un object store
  let objectStore = DB.transaction('citas').objectStore('citas')
  
  // Esto retorna una petición
  objectStore.openCursor().onsuccess = (e) => {
    // el cursor se va a indicar en el registro indicado para acceder a los datos
    let cursor = e.target.result;

    if(cursor) {
      let citaHTML = document.createElement('li')
      citaHTML.setAttribute('data-cita-id', cursor.key)
      citaHTML.classList.add('list-group-item')

      citaHTML.innerHTML = `
        <p><strong>Mascota:</strong> ${cursor.value.mascota}</p>
        <p><strong>Cliente:</strong> ${cursor.value.cliente}</p>
        <p><strong>Télefono:</strong> ${cursor.value.telefono}</p>
        <p><strong>Fecha:</strong> ${cursor.value.fecha}</p>
        <p><strong>Hora:</strong> ${cursor.value.hora}</p>
        <p><strong>Sintomas:</strong> ${cursor.value.sintomas}</p>
      `;
      // botón de borrar
      const botonBorrar = document.createElement('button')
      botonBorrar.classList.add('borrar', 'btn', 'btn-danger')
      botonBorrar.innerHTML = '<span aria-hidden="true">x</span> Borrrar'
      botonBorrar.onclick = borrarCita;
      citaHTML.appendChild(botonBorrar)

      citasListado.appendChild(citaHTML)
      cursor.continue() // Coninua con la siguiente consulta
    } else {
      if (!citasListado.firstChild) { // Cuando no hay registros/citas
        heading.textContent = 'Agrega citas para comenzar'
        let listado = document.createElement('p')
        listado.classList.add('text-center')
        listado.textContent = 'No hay registros'
        citasListado.appendChild(listado)
      } else {
        heading.textContent = 'Administra tus citas'
      }
    }
  }
}

function borrarCita(e) {
  const citaID = Number(e.target.parentElement.getAttribute('data-cita-id'));

  // En indexed DB utilizamos las transacciones
  let transaction = DB.transaction(['citas'], 'readwrite')
  let objectStore = transaction.objectStore('citas')
  let peticion = objectStore.delete(citaID)

  // Borrar también del DOM
  transaction.oncomplete = () => {
    e.target.parentElement.parentElement.removeChild(e.target.parentElement)
    alert(`Se elimino la cita, con el ID: ${citaID}`)
    if (!citasListado.firstChild) { // Cuando no hay registros/citas
      heading.textContent = 'Agrega citas para comenzar'
      let listado = document.createElement('p')
      listado.classList.add('text-center')
      listado.textContent = 'No hay registros'
      citasListado.appendChild(listado)
    } else {
      heading.textContent = 'Administra tus citas'
    }
  }
}