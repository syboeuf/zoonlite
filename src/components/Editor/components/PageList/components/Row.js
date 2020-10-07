import React, { Component } from "react"
import {
	StyleSheet,
	Animated,
	TouchableOpacity,
	Text,
	Easing,
	Alert,
	InteractionManager,
} from "react-native"
import PropTypes from "prop-types"

import { bindActionCreators } from "redux"
import * as Actions from "src/actions/editor"
import { connect } from "react-redux"

import * as constants from "src/constants/constants"

const styles = StyleSheet.create({
	row: {
		flexDirection: "column",
		justifyContent: "center",
		backgroundColor: "#fff",
		width: constants.THUMBNAIL_WIDTH,
		height: constants.THUMBNAIL_HEIGHT,
		marginLeft: constants.THUMBNAIL_MARGIN,
		borderWidth: 2,
		borderRadius: 4,
		elevation: 0,
	},
	text: {
		fontSize: 20,
		textAlign: "center",
	},
	deletePageButton: {
		position: "absolute",
		left: -5,
		top: -5,
		width: 20,
		height: 20,
		backgroundColor: "red",
		borderRadius: 100,
	},
})

class Row extends Component {

	constructor(props) {
		super(props)
		this.active = new Animated.Value(0)
		this.style = {
			transform: [{
				scale: this.active.interpolate({
					inputRange: [0, 1],
					outputRange: [1, 1.07],
				}),
			}],
			elevation: this.active.interpolate({
				inputRange: [0, 1],
				outputRange: [2, 6],
			}),
		}
	}

	componentWillReceiveProps(nextProps) {
		const {
			active, actions, data, projectData, index,
		} = nextProps
		const { pageIds } = projectData.story
		if (active !== this.props.active) {
			console.log(Number(active))
			Animated.timing(this.active, {
				duration: 300,
				easing: Easing.bounce,
				toValue: Number(active),
			}).start()
			actions.reorderPages(pageIds.indexOf(data), index)
		}
	}

	confirmDeletePage = (data) => {
		const { actions } = this.props
		Alert.alert(
			data,
			"Do you want to delete this page?",
			[
				{ text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
				{ text: "OK", onPress: () => actions.deletePage(data) },
			],
			{ cancelable: false },
		)
	}

	render() {
		const {
			data, currentPageId,
		} = this.props
		return (
			<Animated.View style={ [styles.row, this.style, { borderColor: (currentPageId === data) ? "red" : null }] }>
				<TouchableOpacity
					style={ styles.deletePageButton }
					onPress={ () => this.confirmDeletePage(data) }
				/>
				<Text style={ styles.text }>
					{ data }
				</Text>
			</Animated.View>
		)
	}

}

Row.propTypes = {
	data: PropTypes.string.isRequired,
	index: PropTypes.number.isRequired,
	active: PropTypes.bool.isRequired,
	currentPageId: PropTypes.string,
	projectData: PropTypes.object,
	actions: PropTypes.object,
}

const mapStateToProps = (state) => {
	const { ui, project } = state.editor
	return {
		currentPageId: ui.currentPageId,
		projectData: project.projectData,
	}
}
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch),
})
Row = connect(mapStateToProps, mapDispatchToProps)(Row)

export default Row
