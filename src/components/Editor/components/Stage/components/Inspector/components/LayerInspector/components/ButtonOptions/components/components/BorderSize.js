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

const BorderSize = ({ updateDrawingStyle, borderWidth }) => (
	<View style={ styles.container }>
		<TouchableOpacity
			onPress={ () => updateDrawingStyle("borderWidth", borderWidth - 1) }
			style={ styles.buttons }
		>
			<Text style={ styles.text }>-</Text>
		</TouchableOpacity>
		<Text>{ borderWidth }</Text>
		<TouchableOpacity
			onPress={ () => updateDrawingStyle("borderWidth", borderWidth + 1) }
			style={ styles.buttons }
		>
			<Text style={ styles.text }>+</Text>
		</TouchableOpacity>
	</View>
)

BorderSize.propTypes = {
	borderWidth: PropTypes.number.isRequired,
	updateDrawingStyle: PropTypes.func.isRequired,
}

export default BorderSize
