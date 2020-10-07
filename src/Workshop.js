import React, { Component } from "react"
import {
	StyleSheet, TouchableOpacity, Text, View,
} from "react-native"
import PropTypes from "prop-types"

import { bindActionCreators } from "redux"
import * as Actions from "src/actions/projects"
import { connect } from "react-redux"

import { clearDatabase } from "src/utils/fileProvider"

import CollectionView from "./components/CollectionView"
import ProjectCard from "./components/ProjectCard"
import FabButton from "./components/FabButton"

const defaultMaxCardWidth = 500
const defaultCardSpacing = 10

const styles = StyleSheet.create({
	clearButton: {
		width: 60,
		height: 30,
		alignItems: "center",
		backgroundColor: "green",
	},
	editButton: {
		width: 60,
		height: 30,
		alignItems: "center",
		backgroundColor: "red",
	},
	wrapper: {
		flex: 1,
	},
	createProjectButton: {
		flex: 1,
		position: "absolute",
		right: 0,
		bottom: 0,
		marginRight: 10,
		marginBottom: 10,
	},
})

class Workshop extends Component {

	static navigationOptions = ({ navigation }) => ({
		headerLeft: (
			<TouchableOpacity
				style={ styles.clearButton }
				onPress={ clearDatabase }
			>
				<Text>Clear</Text>
			</TouchableOpacity>
		),
		headerRight: (
			<TouchableOpacity
				style={ styles.editButton }
				onPress={ navigation.getParam("toggleViewMode") }
			>
				<Text>Edit</Text>
			</TouchableOpacity>
		),
	})

	constructor(props) {
		super(props)
		this.state = {
			isInListEditMode: false,
			collectionViewSize: { width: 0, height: 0 },
		}
	}

	componentWillMount() {
		const { navigation, actions } = this.props
		navigation.setParams({ toggleViewMode: this.toggleViewMode })
		actions.listProjects()
	}

	componentWillReceiveProps(nextProps) {
		const { navigation, currentProjectId } = nextProps
		if (currentProjectId) {
			this.setState({ isInListEditMode: false },
				() => navigation.navigate("Editor", { projectId: currentProjectId }))
		}
	}

	onLayout = (e) => {
		this.setState({ collectionViewSize: { ...e.nativeEvent.layout } })
	}

	toggleViewMode = () => {
		const { projectsArray } = this.props
		if (projectsArray.length === 0) {
			this.setState({ isInListEditMode: false })
		} else {
			this.setState({ isInListEditMode: !this.state.isInListEditMode })
		}
	}

	renderItem = (content, cardSize, cardSpacing, isOnFirstRow) => (
		<ProjectCard
			content={ content }
			size={ cardSize }
			spacing={ cardSpacing }
			isOnFirstRow={ isOnFirstRow }
			isInListEditMode={ this.state.isInListEditMode }
			actions={ this.props.actions }
		/>
	)

	render() {
		const { projectsArray, actions } = this.props
		const { isInListEditMode, collectionViewSize } = this.state
		return (
			<View
				style={ styles.wrapper }
				onLayout={ this.onLayout }
			>
				<CollectionView
					data={ projectsArray }
					renderItem={ this.renderItem }
					extraData={ { isInListEditMode } }
					size={ collectionViewSize }
					maxCardWidth={ defaultMaxCardWidth }
					cardSpacing={ defaultCardSpacing }
				/>
				<View style={ styles.createProjectButton }>
					<FabButton
						path="M38 26H26v12h-4V26H10v-4h12V10h4v12h12v4z"
						onClick={ actions.createProject }
					/>
				</View>
			</View>
		)
	}

}

const mapStateToProps = (state) => {
	const { list, currentProjectId } = state.projects
	return {
		projectsArray: Object.values(list || {}),
		currentProjectId,
	}
}
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch),
})
Workshop = connect(mapStateToProps, mapDispatchToProps)(Workshop)

Workshop.propTypes = {
	navigation: PropTypes.object.isRequired,
	projectsArray: PropTypes.array,
	currentProjectId: PropTypes.string,
	actions: PropTypes.object,
}

export default Workshop
