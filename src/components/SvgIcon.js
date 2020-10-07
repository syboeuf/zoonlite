import React from "react"
import { StyleSheet, View } from "react-native"
import PropTypes from "prop-types"
import Svg, { Path } from "react-native-svg"
// if we use expo use this: import { Svg } from "expo"

// if we use expo use this: const { Path } = Svg

const length = 48

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		marginTop: 5,
	},
})

const SvgIcon = ({ path }) => (
	<View style={ styles.container }>
		<Svg
			width={ length }
			height={ length }
		>
			<Path d={ path } />
		</Svg>
	</View>
)

SvgIcon.propTypes = {
	path: PropTypes.string.isRequired,
}

export default SvgIcon
