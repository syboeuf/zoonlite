import React from "react"
import { View, StyleSheet } from "react-native"
import PropTypes from "prop-types"

const styles = StyleSheet.create({
	viewportBorder: {
		position: "absolute",
		borderWidth: 2,
		borderColor: "red",
	},
})

const ViewportBorder = ({ rect }) => (
	<View
		style={ { ...styles.viewportBorder, ...rect } }
		pointerEvents="none"
	/>
)

ViewportBorder.propTypes = {
	rect: PropTypes.object.isRequired,
}

export default ViewportBorder