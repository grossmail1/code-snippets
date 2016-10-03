import React, { Component } from 'react'
import debounce from 'lodash/debounce'
import { isDevice } from '../util/Device'
class Popover extends Component {

	constructor(props) {
		super(props)

		this.checkMouseInPopup = debounce(this.checkMouseInPopup.bind(this), 250, { maxWait: 500 })
	}

	componentDidMount() {
		let popup = this.getPosition(this._hoverCheck)
		this.setState({ popup }) // eslint-disable-line react/no-did-mount-set-state
		// if we are using a desktop check mouse movement
		if(!isDevice()) {
			document.addEventListener('mousemove', this.checkMouseInPopup)
		}
	}

	componentWillUnmount() {
		document.removeEventListener('mousemove', this.checkMouseInPopup)
	}

	checkMouseInPopup(event) {
		/* this seems like it could be done easier but the onmouseleave event is called if you move your mouse to
		 something that is positioned over the popup such as the popover.  This check is just looking to see if the mouse
		 is still above the popup
		 */
		if (this._hoverCheck && !this.pointInPopup(event.clientX, event.clientY, this.state.popup)) {
			this.props.onRequestClose(event)
		}
	}

	pointInPopup = (x, y, popup) => {
		// returns true if the x and y are in the given popup
		return (x >= popup.x && y >= popup.y && (x < popup.x + popup.width) && (y < popup.y + popup.height))
	}

	getPosition(el) {
		let xPos = 0
		let yPos = 0
		const height = el.offsetHeight
		const width = el.offsetWidth

		while (el) {
			if (el.tagName == 'BODY') {
				// deal with browser quirks with body/window/document and page scroll
				var xScroll = el.scrollLeft || document.documentElement.scrollLeft
				var yScroll = el.scrollTop || document.documentElement.scrollTop

				xPos += (el.offsetLeft - xScroll + el.clientLeft)
				yPos += (el.offsetTop - yScroll + el.clientTop)
			} else {
				// for all other non-BODY elements
				xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft)
				yPos += (el.offsetTop - el.scrollTop + el.clientTop)
			}

			el = el.offsetParent
		}
		return {
			x: xPos,
			y: yPos,
			height,
			width
		}
	}

	render() {
		const spacing = 15
		const { parentEl, anchorEl, pushRight, position } = this.props

		if (this.props.open) {
			const right = parentEl.offsetWidth - anchorEl.offsetLeft - anchorEl.offsetWidth
			const popupStyle = {
				base: {
					backgroundColor: '#fff',
					border: '1px solid #ccc',
					borderRadius: '5px',
					position: 'absolute',
					right: pushRight ? right - 10 : right,
					bottom: position === 'top' ? 0 : '',
					top: position === 'bottom' ? 0 : '',
					boxSizing: 'border-box',
					overflow: 'hidden',
					minWidth: anchorEl.offsetWidth,
					zIndex: 199
				}
			}
			const arrowStyle = {
				base: {
					position: 'absolute',
					width: 0,
					height: 0,
					top: position === 'top' ? 'calc(100% - 1px)' : '',
					bottom: position === 'bottom' ? 'calc(100% - 1px)' : '',
					left: (anchorEl.offsetWidth / 2) + anchorEl.offsetLeft - 9,
					borderTop: position === 'top' ? '9px solid #fff' : '9px solid transparent',
					borderBottom: position === 'bottom' ? '9px solid #fff' : '9px solid transparent',
					borderLeft: '9px solid transparent',
					borderRight: '9px solid transparent',
					zIndex: 200
				}
			}
			const arrowBorderStyle = {
				base: {
					position: 'absolute',
					width: 0,
					height: 0,
					top: position === 'top' ? 'calc(100% - 1px)' : '',
					bottom: position === 'bottom' ? 'calc(100% - 1px)' : '',
					left: (anchorEl.offsetWidth / 2) + anchorEl.offsetLeft - 10,
					borderTop: position === 'top' ? '10px solid #ccc' : '10px solid transparent',
					borderBottom: position === 'bottom' ? '10px solid #ccc' : '10px solid transparent',
					borderLeft: '10px solid transparent',
					borderRight: '10px solid transparent',
					zIndex: 198
				}
			}

			const containerStyle = {
				base: {
					position: 'absolute',
					width: '100%',
					height: '100%',
					bottom: position === 'top' ? `calc(100% + ${spacing}px)` : '',
					top: position === 'bottom' ? `calc(100% + ${spacing}px)` : '',
					left: 0,
					zIndex: 100
				}
			}

			const hoverCheckStyle = {
				zIndex: 95,
				position: 'absolute',
				width: '100%',
				bottom: `-${anchorEl.offsetHeight + spacing + 10}px`,
				left: 0,
				height: 190
			}

			return (
				<div style={containerStyle.base}>
					<div style={popupStyle.base}>
						{this.props.children}
					</div>
					<div style={arrowStyle.base}></div>
					<div style={arrowBorderStyle.base}></div>
					<div style={ hoverCheckStyle } ref={c => this._hoverCheck = c}></div>
					<div style={{ position: 'fixed', width: '100%', height: '100%', top: 0, left: 0, zIndex: 90 }}
						 onClick={this.props.onRequestClose}></div>
				</div>
			)
		} else {
			return null
		}
	}

}

Popover.propTypes = {
	open: React.PropTypes.bool.isRequired,
	onRequestClose: React.PropTypes.func.isRequired,
	position: React.PropTypes.string.isRequired,
	anchorEl: React.PropTypes.any.isRequired,
	parentEl: React.PropTypes.any.isRequired,
	pushRight: React.PropTypes.bool
}

export default Popover