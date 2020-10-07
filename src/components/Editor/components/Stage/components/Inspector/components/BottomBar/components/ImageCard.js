import React from "react"
import { View, TouchableOpacity, Image } from "react-native"
import PropTypes from "prop-types"

const ImageCard = ({ src, size, addImageToPage }) => (
	<View>
		<TouchableOpacity onPress={ () => addImageToPage({ src }) }>
			<Image
				style={ size }
				source={ { uri: src } }
			/>
		</TouchableOpacity>
	</View>
)

ImageCard.propTypes = {
	src: PropTypes.string.isRequired,
	size: PropTypes.object.isRequired,
	addImageToPage: PropTypes.func.isRequired,
}

export default ImageCard