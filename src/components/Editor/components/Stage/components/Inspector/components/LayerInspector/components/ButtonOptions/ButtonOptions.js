import React, { Component } from "react"
import {
	View, Text, TouchableOpacity, StyleSheet,
} from "react-native"
import PropTypes from "prop-types"

import Option from "./components/Option"

const buttonWidth = 40

const editOptionArray = [
	"FontName",
	"FontSize",
	"TextColor",
	"backgroundColor",
	"BorderWidth",
	"BorderColor",
	"borderRadius",
]

const styles = StyleSheet.create({
	buttonOptions: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
})

class ButtonOptions extends Component {

	constructor(props) {
		super(props)
		this.state = {
			isActiveOption: "",
		}
	}

	render() {
		const { handleUpdatingDataBalloon, selectedBalloonData } = this.props
		const { isActiveOption } = this.state
		return (
			<View>
				<View style={ styles.buttonOptions }>
					{
						editOptionArray.map((button) => (
							<TouchableOpacity
								key={ `button-${button}` }
								onPress={ () => this.setState({ isActiveOption: (isActiveOption === "" || isActiveOption !== button) ? button : "" }) }
								style={
									{
										width: buttonWidth,
										backgroundColor: (isActiveOption === button) ? "grey" : "blue",
									}
								}
							>
								<Text style={ { color: (isActiveOption === button) ? "black" : "white" } }>{ button }</Text>
							</TouchableOpacity>
						))
					}
				</View>
				<Option
					isActiveOption={ isActiveOption }
					selectedBalloonData={ selectedBalloonData }
					handleUpdatingDataBalloon={ handleUpdatingDataBalloon }
				/>
			</View>
		)
	}

}

ButtonOptions.propTypes = {
	selectedBalloonData: PropTypes.object.isRequired,
	handleUpdatingDataBalloon: PropTypes.func.isRequired,
}

export default ButtonOptions
