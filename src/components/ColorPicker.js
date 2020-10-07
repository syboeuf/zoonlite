import React from "react"
import {
	StyleSheet, View, TouchableOpacity, Text,
} from "react-native"
import PropTypes from "prop-types"

const colorArray = [
	{ name: "Noir", color: "#000000" },
	{ name: "Blanc", color: "#FFFFFF" },
	{ name: "Bleu", color: "#0000FF" },
	{ name: "Vert", color: "#00FF00" },
	{ name: "Rouge", color: "#FF0000" },
]

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	buttons: {
		width: 40,
		height: 40,
		borderWidth: 1,
		borderColor: "black",
	},
})

const ColorPicker = ({ updateData, propertyCss }) => (
	<View style={ styles.container }>
		{
			colorArray.map((button) => (
				<TouchableOpacity
					onPress={ () => updateData(propertyCss, button.color) }
					style={ { ...styles.buttons, backgroundColor: button.color } }
					key={ `button-${button.name}` }
				>
					<Text>{ button.name }</Text>
				</TouchableOpacity>
			))
		}
	</View>
)

ColorPicker.propTypes = {
	updateData: PropTypes.func.isRequired,
	propertyCss: PropTypes.string.isRequired,
}

export default ColorPicker