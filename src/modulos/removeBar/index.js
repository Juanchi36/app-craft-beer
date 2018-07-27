import Handlebars from 'handlebars'

import template from './template.html'

import firebase from 'firebase'

let database

let mensaje = ''

let bares = []

let cargando = true

export default (_database) => {
	database = _database
	bares = []
	mensaje = ''
	listarBares()
}

const listarBares = () => {
	const lista = database
		.ref('/bares')
		.once('value')
		.then((datos_bares) => {
			datos_bares.forEach((element) => {
				const datosBar = element.val()
				datosBar.id = element.key
				bares.push(datosBar)
			})
			cargando = false
			render()
		})
		.catch(function (error) {
			console.error('Error adding document: ', error)
		})
}
const deleteCard = (bar) => {
	database
		.ref(`bares/${bar.id}`)
		.remove()
		.then(() => {
			mensaje = '📢 Cervecería eliminada'
			bares = []
			document.getElementById('main').innerHTML = ''
			render()
		})
		.catch(() => {
			mensaje = '⛔ Solo el administrador puede eliminar una cervecería'
			render()
		})
	listarBares()
}
const render = () => {
	const t = Handlebars.compile(template)
	document.getElementById('mensaje').innerHTML = t({ mensaje })
	document.getElementById('main').innerHTML = t({ cargando, bares })
	const trashClass = document.getElementsByClassName('trash')
	for (let i = 0; i < trashClass.length; i++) {
		trashClass[i].addEventListener(
			'click',
			function () {
				deleteCard(this)
			},
			false
		)
	}
}
