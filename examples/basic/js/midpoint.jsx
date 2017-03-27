import React from 'react'
import Axios from 'axios'

class Midpoint extends React.Component {
		constructor(props) {
			super(props)
			this.stuff = {}
		}

		refresh() {
			var keys = []
			var gets = []

			for(let k in this.props) {
				if(typeof(this.props[k]) === 'string') {
					keys.push(k)
					gets.push(Axios.get(this.props[k]))
				}
			}

			Promise.all(gets).then(neat => {
				for(let i in keys) {
					this.stuff[keys[i]] = neat[i].data
				}
				this.forceUpdate()
			})
		}

		componentDidMount() {
			this.refresh()
		}

		shouldComponentUpdate() {
			return false
		}

		render() {
			var child = React.cloneElement(this.props.children, {
				...this.stuff,
				refresh: this.refresh.bind(this),
			})
			return child
		}
}

export default Midpoint

