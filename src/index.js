import Navigo from 'navigo'
import firebase from 'firebase'
import catchLinks from 'catch-links'

import ranking from './modulos/ranking'
import addBar from './modulos/addBar'
import removeBar from './modulos/removeBar'

import firebaseConfig from '../firebase.config'

import './index.scss'

firebase.initializeApp(firebaseConfig)

const database = firebase.database()

var root = null
var useHash = false

var router = new Navigo(root, useHash)

router
	.on({
		ranking: () => {
			ranking(database), (document.getElementById('welcome').hidden = true)
		},
		addBar: () => {
			addBar(database), (document.getElementById('welcome').hidden = true)
		},
		removeBar: () => {
			removeBar(database), (document.getElementById('welcome').hidden = true)
		}
	})
	.resolve()

catchLinks(window, (href) => {
	router.navigate(href)
})

document.getElementById('login').onclick = () => {
	const provider = new firebase.auth.GoogleAuthProvider()
	firebase
		.auth()
		.signInWithPopup(provider)
		.then((result) => {
			// document.getElementById('usrName').innerHTML = `${result.user
			// 	.displayName}`
			document.getElementById('usrPhoto').hidden = false
			document.getElementById('usrPhoto').src = result.user.photoURL
			document.getElementById('login').hidden = true
			document.getElementById('logout').hidden = false
			//document.getElementById('navigate').hidden = false
			//document.getElementById('enter').innerHTML = ''
		})
		.catch((error) => console.log(`Error ${error.code}:${error.message}`))
}

document.getElementById('logout').onclick = () => {
	firebase
		.auth()
		.signOut()
		.then((result) => {
			// document.getElementById('usrName').innerHTML = ''
			document.getElementById('usrPhoto').src = ''
			document.getElementById('login').hidden = false
			document.getElementById('logout').hidden = true
			document.getElementById('usrPhoto').hidden = true
		})
		.catch((error) => console.log(`Error ${error.code}:${error.message}`))
}
