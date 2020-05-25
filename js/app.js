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

// IndexDB requiere que el DOM este listo
document.addEventListener('DOMContentLoaded', () => {
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

  }

})