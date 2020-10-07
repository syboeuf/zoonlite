import React from "react"
import { View, Text, Button } from "react-native"
import PropTypes from "prop-types"

const Player = ({ navigation }) => (
	<View>
		<Text>This is the Player</Text>
		<Button
			title="Go to Home"
			onPress={ () => navigation.navigate("Workshop") }
		/>
	</View>
)

Player.propTypes = {
	navigation: PropTypes.object.isRequired,
}

export default Player