import React, { Component } from "react"
import {
	View, StyleSheet, Text, Animated, Easing,
} from "react-native"
import PropTypes from "prop-types"

import { bindActionCreators } from "redux"
import * as Actions from "src/actions/editor"
import { connect } from "react-redux"

import * as constants from "src/constants/constants"
import { getLayerDataArray } from "src/reducers/editor"
import Layer from "./components/Layer"
import SelectRect from "./components/SelectRect"
import Inspector from "./components/Inspector"
import ViewportBorder from "./components/ViewportBorder"

const defaultWidth = 1920
const defaultHeight = 1080

const aspectRatio = constants.ASPECT_RATIO
const margin = constants.VIEWPORT_BORDER_MARGIN

const durationForInspectorAnimation = 250

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
	},
	buttonMenu: {
		height: 30,
		width: 60,
		position: "absolute",
		backgroundColor: "red",
	},
})

class Stage extends Component {

	constructor(props) {
		super(props)
		this.state = {
			scale: 1,
			isActiveInspector: false,
			viewportBorderRect: {
				left: 0, top: 0, width: 0, height: 0,
			},
			updatingData: {},
			updatingDataBalloon: {},
		}
	}

	componentWillMount() {
		this.bottomPosition = new Animated.Value(-constants.LAYER_INSPECTOR_PORTRAIT_HEIGHT)
	}

	componentWillReceiveProps(nextProps) {
		const { stageSize, selectedLayerIds, actions } = nextProps
		const { updatingDataBalloon } = this.state
		if ((this.props.selectedLayerIds !== selectedLayerIds)) {
			if (Object.keys(updatingDataBalloon).length > 0) {
				actions.updateballoonDataVariables(updatingDataBalloon.elementId, updatingDataBalloon.balloon)
			}
			this.setState({ updatingDataBalloon: {} })
		}
		if (stageSize !== this.props.stageSize) {
			this.getScaleAndViewportBorderRect(stageSize)
		} else {
			this.setState({ updatingData: { balloon: this.state.updatingData.balloon } })
		}
	}

	getScaleAndViewportBorderRect = (stageSize) => {
		const { width, height } = stageSize
		let scale = 1
		const viewportBorderRect = {
			width: width - 2 * margin,
			height: height - 2 * margin,
		}
		if ((width - 2 * margin) / (height - 2 * margin) >= aspectRatio) {
			viewportBorderRect.width = viewportBorderRect.height * aspectRatio
			scale = viewportBorderRect.width / defaultWidth
		} else {
			viewportBorderRect.height = viewportBorderRect.width / aspectRatio
			scale = viewportBorderRect.height / defaultHeight
		}
		viewportBorderRect.left = (width - viewportBorderRect.width) / 2
		viewportBorderRect.top = (height - viewportBorderRect.height) / 2
		this.setState({ scale, viewportBorderRect })
	}

	handleUpdatingData = (updatingData) => {
		this.setState({ updatingData })
	}

	handleUpdatingDataBalloon = (updatingDataBalloon) => {
		this.setState({ updatingDataBalloon })
	}

	getRect = (layerData, updatingData, scale, stageSize) => {
		let actualVariables = { ...layerData }
		if (layerData.id === updatingData.id) {
			actualVariables = { ...actualVariables, ...updatingData }
		}
		const {
			x, y, w, h, o, r,
		} = actualVariables
		const absVectToTopLeft = {
			x: ((x || 0) - w / 2) * scale,
			y: ((y || 0) - h / 2) * scale,
		}
		const imageRect = {
			left: stageSize.width / 2 + absVectToTopLeft.x,
			top: stageSize.height / 2 + absVectToTopLeft.y,
			width: w * scale,
			height: h * scale,
			opacity: (o !== undefined) ? o : 1,
			r: (r !== undefined) ? r : 0,
		}
		return imageRect
	}

	getBalloonData = (layerData, updatingDataBalloon) => {
		let actualVariables = { ...layerData }
		if (layerData.id === updatingDataBalloon.id) {
			actualVariables = { ...actualVariables, ...updatingDataBalloon }
		}
		return actualVariables
	}

	animatedInspector = (toValue, duration) => {
		Animated.timing(
			this.bottomPosition,
			{
				toValue,
				duration,
				easing: Easing.linear,
			},
		).start()
	}

	render() {
		const {
			stageSize, selectedLayerIds, layerDataArray, motionCaptureData,
		} = this.props
		const {
			scale, viewportBorderRect, updatingData, updatingDataBalloon, isActiveInspector,
		} = this.state
		let selectRectRect
		let selectedLayerData = {}
		let selectedBalloonData = {}
		return (
			<View style={ styles.wrapper }>
				{
					layerDataArray.map((layerData) => {
						let balloonData = {}
						const isSelected = ((selectedLayerIds.length > 0)
							&& (selectedLayerIds[0] === layerData.id))
						const rect = this.getRect(layerData, updatingData, scale, stageSize)
						if (layerData.balloon) {
							balloonData = this.getBalloonData(layerData, updatingDataBalloon)
						}
						if (isSelected === true) {
							selectRectRect = rect
							selectedLayerData = layerData
							if (layerData.balloon) {
								selectedBalloonData = this.getBalloonData(layerData, updatingDataBalloon)
							}
						}
						return (
							<Layer
								key={ `layer-${layerData.id}` }
								scale={ scale }
								rect={ rect }
								layerData={ layerData }
								isSelected={ isSelected }
								balloonData={ balloonData }
								updatingData={ updatingData }
								handleUpdatingData={ this.handleUpdatingData }
								handleUpdatingDataBalloon={ this.handleUpdatingDataBalloon }
								motionCaptureData={ motionCaptureData }
								stageSize={ stageSize }
							/>
						)
					})
				}
				<ViewportBorder rect={ viewportBorderRect } />
				{
					(selectRectRect && motionCaptureData.state === "inactive")
						? (
							<SelectRect
								scale={ scale }
								stageSize={ stageSize }
								rect={ selectRectRect }
								layerData={ selectedLayerData }
								updatingData={ updatingData }
								handleUpdatingData={ this.handleUpdatingData }
							/>
						)
						: null
				}
				<View
					style={
						{
							...styles.buttonMenu,
							bottom: ((isActiveInspector)) ? constants.PAGE_INSPECTOR_PORTRAIT_HEIGHT : 0,
						}
					}
				>
					<Text
						onPress={ () => this.setState({ isActiveInspector: !this.state.isActiveInspector }, () => {
							const { isActiveInspector } = this.state
							if (isActiveInspector) {
								this.animatedInspector(constants.PAGE_INSPECTOR_PORTRAIT_HEIGHT, durationForInspectorAnimation)
							} else {
								this.animatedInspector(-constants.PAGE_INSPECTOR_PORTRAIT_HEIGHT, durationForInspectorAnimation)
							}
						}) }
					>
						{ (isActiveInspector) ? "Hide menu" : "Show Menu" }
					</Text>
				</View>
				{
					(isActiveInspector)
						? (
							<Animated.View style={ { position: "absolute", bottom: this.bottomPosition } }>
								<Inspector
									layerDataArray={ layerDataArray }
									stageSize={ stageSize }
									rect={ selectRectRect }
									layerData={ selectedLayerData }
									selectedBalloonData={ selectedBalloonData }
									handleUpdatingDataBalloon={ this.handleUpdatingDataBalloon }
									handleUpdatingData={ this.handleUpdatingData }
									motionCaptureData={ motionCaptureData }
								/>
							</Animated.View>
						)
						: null
				}
			</View>
		)
	}

}

const mapStateToProps = (state) => {
	const {
		currentPageId, selectedLayerIds, motionCaptureData,
	} = state.editor.ui
	return {
		currentPageId,
		selectedLayerIds,
		layerDataArray: getLayerDataArray(state),
		motionCaptureData,
	}
}
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch),
})

Stage = connect(mapStateToProps, mapDispatchToProps)(Stage)

Stage.propTypes = {
	stageSize: PropTypes.object.isRequired,
	currentPageId: PropTypes.string,
	selectedLayerIds: PropTypes.arrayOf(PropTypes.string),
	layerDataArray: PropTypes.arrayOf(PropTypes.object),
	motionCaptureData: PropTypes.object,
	actions: PropTypes.object,
}

export default Stage
