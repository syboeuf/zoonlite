import React from "react"
import { View, Slider } from "react-native"
import PropTypes from "prop-types"

const multiplyPorcent = 100

const BorderRadius = ({ updateDrawingStyle, borderRadius }) => (
	<View>
		<Slider
			value={ (borderRadius !== undefined) ? borderRadius / multiplyPorcent : 1 }
			onValueChange={ (value) => updateDrawingStyle("borderRadius", value * multiplyPorcent) }
		/>
	</View>
)

BorderRadius.propTypes = {
	updateDrawingStyle: PropTypes.func.isRequired,
	borderRadius: PropTypes.number.isRequired,
}

export default BorderRadius
