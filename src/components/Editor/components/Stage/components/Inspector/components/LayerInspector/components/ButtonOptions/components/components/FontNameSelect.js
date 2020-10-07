import React from "react"
import PropTypes from "prop-types"

import DropDownSelect from "src/components/DropDownSelect"

const fontNameArray = [
	"sans-serif-condensed",
	"sans-serif-medium",
	"serif",
	"Roboto",
	"monospace",
]

const FontNameSelect = ({ updateTextStyle, fontName }) => (
	<DropDownSelect
		dataArray={ fontNameArray }
		updateData={ updateTextStyle }
		selectedValue={ fontName }
	/>
)

FontNameSelect.propTypes = {
	updateTextStyle: PropTypes.func.isRequired,
	fontName: PropTypes.string.isRequired,
}

export default FontNameSelect
