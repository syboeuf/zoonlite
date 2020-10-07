import React, { Component } from "react"
import {
	Keyboard, TextInput, View,
} from "react-native"
import PropTypes from "prop-types"

import * as constants from "src/constants/constants"

class EditText extends Component {

	constructor(props) {
		super(props)
		this.state = {
			layout: {},
			stageSize: {},
			topPosition: 0,
		}
	}

	componentWillMount() {
		const { stageSize } = this.props
		if (stageSize !== {}) {
			this.setState({
				stageSize,
				topPosition: stageSize.height + constants.BOTTOM_BAR_HEIGHT,
			})
		}
	}

	componentDidMount() {
		this.keyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			this.keyboardDidShow,
		)
		this.keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			this.keyboardDidHide,
		)
	}


	componentWillReceiveProps(nextProps) {
		const { stageSize } = nextProps
		if (this.props.stageSize !== stageSize) {
			this.topPosition = nextProps.stageSize.height
			this.setState({
				stageSize,
				topPosition: nextProps.stageSize.height,
			})
		}
	}

	componentWillUnmount() {
		this.keyboardDidShowListener.remove()
		this.keyboardDidHideListener.remove()
	}

	keyboardDidShow = (e) => {
		const { stageSize, layout } = this.state
		this.setState({
			stageSize,
			topPosition: stageSize.height - e.endCoordinates.height - layout.height,
		})
	}

	keyboardDidHide = () => {
		const { stageSize } = this.state
		this.setState({
			stageSize,
			topPosition: stageSize.height,
		})
	}

	onLayout = (e) => {
		this.setState({ layout: e.nativeEvent.layout })
	}

	render() {
		const { onChangeText, text, rect } = this.props
		const { stageSize, topPosition } = this.state
		return (
			<View
				onLayout={ this.onLayout }
				style={
					{
						zIndex: 10,
						top: topPosition - rect.top || 0,
						left: -rect.left || 0,
					}
				}
			>
				{
					(stageSize)
						? (
							<TextInput
								ref={ (node) => { this.textInput = node } }
								style={ { width: stageSize.width || 0, backgroundColor: "grey" } }
								placeholder="tap here !!"
								value={ text }
								onChangeText={ (value) => onChangeText(value) }
								placeholderTextColor="white"
								autoFocus={ true }
							/>
						)
						: null
				}
			</View>
		)
	}

}

EditText.propTypes = {
	stageSize: PropTypes.object.isRequired,
	onChangeText: PropTypes.func.isRequired,
	text: PropTypes.string,
	rect: PropTypes.object.isRequired,
}

export default EditText
