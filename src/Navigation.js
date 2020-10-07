import { createStackNavigator, createAppContainer } from "react-navigation"

import Workshop from "./Workshop"
import Editor from "./components/Editor"
import Player from "./components/Player"

let SearchStackNavigator = createStackNavigator({
	Workshop: {
		screen: Workshop,
		navigationOptions: {
			title: "Home",
		},
	},
	Editor: {
		screen: Editor,
		navigationOptions: {
			title: "Editor",
		},
	},
	Player: {
		screen: Player,
		navigationOptions: {
			title: "Player",
		},
	},
})
SearchStackNavigator = createAppContainer(SearchStackNavigator)

export default SearchStackNavigator