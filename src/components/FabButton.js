import React from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import PropTypes from "prop-types"

import SvgIcon from "src/components/SvgIcon"

const styles = StyleSheet.create({
	button: {
		borderRadius: 100,
		width: 60,
		height: 60,
		backgroundColor: "blue",
	},
})

const FabButton = ({ onClick, path }) => (
	<TouchableOpacity
		style={ styles.button }
		onPress={ onClick }
	>
		<SvgIcon path={ path } />
	</TouchableOpacity>
)

FabButton.propTypes = {
	onClick: PropTypes.func,
	path: PropTypes.string.isRequired,
}

export default FabButton