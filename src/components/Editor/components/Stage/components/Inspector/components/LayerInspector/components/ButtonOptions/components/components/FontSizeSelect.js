import React from "react"
import { View, TouchableOpacity, Text } from "react-native"
import PropTypes from "prop-types"

const styles = {
	container: {
		flexDirection: "row",
		justifyContent: "center",
	},
	buttons: {
		backgroundColor: "blue",
		alignItems: "center",
		height: 50,
		width: 50,
		justifyContent: "center",
	},
	text: {
		color: "white",
	},
}

const FontSizeSelect = ({ updateTextStyle, fontSize }) => (
	<View style={ styles.container }>
		<TouchableOpacity
			onPress={ () => updateTextStyle("fontSize", fontSize - 1) }
			style={ styles.buttons }
		>
			<Text style={ styles.text }>-</Text>
		</TouchableOpacity>
		<Text>{ fontSize }</Text>
		<TouchableOpacity
			onPress={ () => updateTextStyle("fontSize", fontSize + 1) }
			style={ styles.buttons }
		>
			<Text style={ styles.text }>+</Text>
		</TouchableOpacity>
	</View>
)

FontSizeSelect.propTypes = {
	fontSize: PropTypes.number.isRequired,
	updateTextStyle: PropTypes.func.isRequired,
}

export default FontSizeSelect
