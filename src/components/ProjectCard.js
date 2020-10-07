import React, { Component } from "react"
import {
	StyleSheet,
	View,
	Text,
	Animated,
	TouchableOpacity,
	Image,
	Alert,
	Easing,
} from "react-native"
import PropTypes from "prop-types"

const animationDuration = 500
const deleteButtonWidthPercent = 0.2

const styles = StyleSheet.create({
	cardTitle: {
		position: "absolute",
		bottom: "40%",
		backgroundColor: "grey",
	},
})

class ProjectCard extends Component {

	componentWillMount() {
		const { size } = this.props
		const deleteButtonWidth = size.width * deleteButtonWidthPercent
		this.leftPosition = new Animated.Value(-deleteButtonWidth)
	}

	componentWillReceiveProps(nextProps) {
		const { isInListEditMode, size } = nextProps
		if (isInListEditMode !== this.props.isInListEditMode) {
			const deleteButtonWidth = size.width * deleteButtonWidthPercent
			Animated.timing(
				this.leftPosition,
				{
					toValue: (isInListEditMode === false) ? -deleteButtonWidth : 0,
					duration: animationDuration,
					easing: Easing.linear,
				},
			).start()
		}
	}

	deleteProject = (projectId) => {
		const { actions } = this.props
		Alert.alert(
			projectId,
			"Do you want to delete this project ?",
			[
				{ text: "Cancel", onPress: () => console.log("Cancel button pressed"), style: "cancel" },
				{
					text: "OK",
					onPress: () => actions.deleteProject(projectId),
				},
			],
			{ cancelable: true },
		)
	}

	render() {
		const {
			content, size, spacing, isOnFirstRow, isInListEditMode, actions,
		} = this.props
		const { width, height } = size
		return (
			<View
				style={
					{
						width,
						height,
						marginLeft: spacing,
						marginTop: (isOnFirstRow === true) ? spacing : 0,
						marginBottom: spacing,
						overflow: "hidden",
					}
				}
			>
				<Animated.View
					style={
						{
							flexDirection: "row",
							left: this.leftPosition,
						}
					}
				>
					<TouchableOpacity
						style={
							{
								width: width * deleteButtonWidthPercent,
								backgroundColor: "blue",
								justifyContent: "center",
							}
						}
						onPress={ () => this.deleteProject(content.id) }
					>
						<Text style={ { textAlign: "center" } }>Delete</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={
							() => ((isInListEditMode === true)
								? null
								: actions.runEditorForProjectWithId(content.id))
						}
					>
						<Image
							style={ size }
							source={ { uri: content.metadata.coverSrc } }
						/>
						<View style={ { ...styles.cardTitle, width } }>
							<Text style={ { textAlign: "center" } }>{ content.id }</Text>
						</View>
					</TouchableOpacity>
				</Animated.View>
			</View>
		)
	}

}

ProjectCard.propTypes = {
	content: PropTypes.object.isRequired,
	size: PropTypes.object.isRequired,
	spacing: PropTypes.number.isRequired,
	isOnFirstRow: PropTypes.bool.isRequired,
	isInListEditMode: PropTypes.bool.isRequired,
	actions: PropTypes.object,
}

export default ProjectCard