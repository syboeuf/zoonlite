import React, { Component } from "react"
import {
	StyleSheet, View, TouchableOpacity, Dimensions,
} from "react-native"
import PropTypes from "prop-types"

import { bindActionCreators } from "redux"
import * as Actions1 from "src/actions/projects"
import * as Actions2 from "src/actions/editor"
import { connect } from "react-redux"

import * as constants from "src/constants/constants"
import FabButton from "src/components/FabButton"
import SvgIcon from "src/components/SvgIcon"
import Stage from "./components/Stage"
import PageList from "./components/PageList"

const durationForBriefPageListDisplay = 2000

const styles = StyleSheet.create({
	pageListButton: {
		flex: 1,
	},
	addPageButton: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "center",
	},
	wrapper: {
		flex: 1,
	},
	stage: {
		position: "absolute",
		top: 0,
		bottom: 0,
	},
	pageList: {
		position: "absolute",
		top: 0,
	},
})

class Editor extends Component {

	static navigationOptions = ({ navigation }) => ({
		headerTitle: (
			<TouchableOpacity
				style={ styles.pageListButton }
				onPress={ navigation.getParam("togglePageList") }
			>
				<SvgIcon
					path="M6 26h4v-4H6v4zm0 8h4v-4H6v4zm0-16h4v-4H6v4zm8 8h28v-4H14v4zm0 8h28v-4H14v4zm0-20v4h28v-4H14z"
				/>
			</TouchableOpacity>
		),
		headerRight: (
			<View style={ styles.addPageButton }>
				<FabButton
					path="M38 26H26v12h-4V26H10v-4h12V10h4v12h12v4z"
					onClick={ navigation.getParam("brieflyShowPageList") }
				/>
			</View>
		),
	})

	constructor(props) {
		super(props)
		this.state = {
			isPageListOpen: false,
			stageSize: { width: 0, height: 0 },
		}
	}

	componentWillMount() {
		const { navigation } = this.props
		navigation.setParams({
			togglePageList: this.togglePageList,
			brieflyShowPageList: this.brieflyShowPageList,
		})
	}

	componentDidMount() {
		const { navigation, actions } = this.props
		const { projectId } = navigation.state.params
		actions.openStory(projectId)
	}

	componentWillUnmount() {
		const { actions } = this.props
		actions.exitProject()
	}

	togglePageList = () => {
		this.setState({ isPageListOpen: !this.state.isPageListOpen })
	}

	brieflyShowPageList = () => {
		const { actions } = this.props
		const { isPageListOpen } = this.state
		actions.addPage()
		if (isPageListOpen === false) {
			this.setState({ isPageListOpen: true }, () => {
				setTimeout(() => {
					this.setState({ isPageListOpen: false }) // LEAVE PAGELIST OPEN IF USER CLICKS ON IT!!!
				}, durationForBriefPageListDisplay)
			})
		}
	}

	onLayout = (e) => {
		const { width, height } = e.nativeEvent.layout
		this.setState({
			stageSize: {
				heightBar: Dimensions.get("window").height - height,
				width,
				height,
			},
		})
	}

	render() {
		const { isPageListOpen, stageSize } = this.state
		return (
			<View
				onLayout={ this.onLayout }
				style={ styles.wrapper }
			>
				<View style={ styles.stage }>
					<Stage stageSize={ stageSize } />
				</View>
				{
					(isPageListOpen === true)
						? (
							<View style={ styles.pageList }>
								<PageList stageSize={ stageSize } />
							</View>
						)
						: null
				}
			</View>
		)
	}

}

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ ...Actions1, ...Actions2 }, dispatch),
})
Editor = connect(null, mapDispatchToProps)(Editor)

Editor.propTypes = {
	navigation: PropTypes.object.isRequired,
	actions: PropTypes.object,
}

export default Editor
