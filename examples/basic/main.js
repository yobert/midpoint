
import React from 'react'
import ReactDOM from 'react-dom'

import Home from './js/home'

function main() {
	ReactDOM.render(React.createElement(Home), document.getElementById("main"))
}

window.main = main;

