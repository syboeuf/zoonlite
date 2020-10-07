import React from "react"
import { View, Picker } from "react-native"
import PropTypes from "prop-types"


const DropDownSelect = ({ dataArray, selectedValue, updateData }) => (
	<View>
		<Picker
			selectedValue={ selectedValue } // Change later by the value save
			onValueChange={ updateData }
		>
			{
				dataArray.map((data) => (
					<Picker.Item
						key={ `size-${data}` }
						label={ data }
						value={ data }
					/>
				))
			}
		</Picker>
	</View>
)

DropDownSelect.propTypes = {
	dataArray: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
	updateData: PropTypes.func.isRequired,
	selectedValue: PropTypes.string.isRequired,
}

export default DropDownSelect