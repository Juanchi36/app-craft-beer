import Handlebars from 'handlebars'
import { guid } from '../../utils'
import firebase from 'firebase'
import template from './template.html'

let mensaje = ''

let database

let downloadUrl = null

let resultadoRating = 'ninguno'

export default (_database) => {
	database = _database
	mensaje = ''
	render()
}

const addCard = (e) => {
	e.preventDefault()
	let radioRating = document.getElementsByName('rating')
	for (let i = 0; i < radioRating.length; i++) {
		if (radioRating[i].checked) {
			resultadoRating = radioRating[i].value
			break
		}
	}
	const bar = {
		id: guid(),
		title: document.getElementById('title').value,
		description: document.getElementById('description').value,
		url: downloadUrl,
		rating: resultadoRating
	}

	database
		.ref(`bares/${bar.id}`)
		.set({
			title: bar.title,
			description: bar.description,
			url: bar.url,
			rating: bar.rating
		})
		.then(() => {
			mensaje = '📢 Cervecería agregada'
			render()
		})
		.catch(() => {
			mensaje = '⛔ Solo el administrador puede agregar una cervecería'
			render()
		})

	return false
}

const render = () => {
	const t = Handlebars.compile(template)

	document.getElementById('main').innerHTML = t({ mensaje })
	document.getElementById('addCard').onclick = addCard

	document.getElementById('fileInput').onchange = (event) => {
		event.preventDefault()
		const image = event.target.files[0]
		const refStorage = firebase.storage().ref(`/fotos/${image.name}`)
		let uploadTask = refStorage.put(image)
		uploadTask.on(
			'state_changed',
			null,
			(error) => {
				console.log('Error al subir el archivo', error)
			},
			() => {
				document.getElementById('ok').innerHTML = '👌 Carga completa!'
				uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
					downloadUrl = downloadURL
				})
			}
		)
	}
}
