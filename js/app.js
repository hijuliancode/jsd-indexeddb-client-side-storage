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
  crearDB.onerror = () => console.log('Hubo un error');

  // Si todo esta bien, mostrar en consola y asignar la base de datos
  crearDB.onsuccess = () => {
    DB = crearDB.result
    // console.log(DB)
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

    console.log('Base de datos creada y lista!', db);

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
  console.log('Enviado, nueva cita', nuevaCita)

  // En indexedDB se utilizan las transacciones
  let transaction = DB.transaction(['citas'], 'readwrite') // 2 modos, readonly o readwrite
  let objectStore = transaction.objectStore('citas') // ObjectStore me permite trabajar con la Db, aquí lo utilizamos para insertar los datos en la DB

  let peticion = objectStore.add(nuevaCita)

  peticion.onsuccess = () => {
    form.reset()
  }

  transaction.oncomplete = () => {
    console.log('Cita agregada =) ')
  }
  transaction.onerror = () => console.error('Hubo un error al agregar los datos')

}