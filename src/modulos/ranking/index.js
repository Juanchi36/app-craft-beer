import Handlebars from 'handlebars'

import template from './template.html'

let database

let bares = []

let cargando = true

export default (_database) => {
	database = _database
	render()
	bares = []
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
		.catch((error) => {
			console.error('Error adding document: ', error)
		})
}

const render = () => {
	const t = Handlebars.compile(template)
	document.getElementById('mensaje').innerHTML = ''
	document.getElementById('main').innerHTML = t({ bares, cargando })
}
