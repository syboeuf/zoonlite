import React, { Component } from "react"
import {
	Image, PanResponder, Animated, Easing, View,
} from "react-native"
import PropTypes from "prop-types"

import { bindActionCreators } from "redux"
import * as Actions from "src/actions/editor"
import { connect } from "react-redux"

import Balloon from "./components/Balloon"


const minimalDistance = 5
class Layer extends Component {

	constructor(props) {
		super(props)
		this.state = {
			inputRange: [],
			xOutputRange: [],
			yOutputRange: [],
			isActivePanReponderTailBalloon: false,
		}
		this.progress = new Animated.Value(0)
	}

	componentWillMount() {
		this.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onStartShouldSetPanResponderCapture: () => false,
			onMoveShouldSetPanResponder: (e, gesture) => {
				if (Math.abs(gesture.dx) < minimalDistance && Math.abs(gesture.dy) < minimalDistance) {
					return false
				}
				if (this.state.isActivePanReponderTailBalloon === true) {
					return false
				}
				return true
			},
			onMoveShouldSetPanResponderCapture: () => false,
			onPanResponderGrant: () => {
				const { motionCaptureData } = this.props
				if (motionCaptureData.state === "recording") {
					this.motionCaptureArray = []
				}
			},
			onPanResponderMove: (e, gesture) => {
				const { motionCaptureData } = this.props
				if (motionCaptureData.state === "playing") {
					return
				}
				const { layerData, handleUpdatingData, rect } = this.props
				if (motionCaptureData.state === "recording") {
					this.motionCaptureArray.push({
						x: gesture.dx,
						y: gesture.dy,
					})
				}
				const newPosition = this.getUpdatedVariables(gesture)
				handleUpdatingData({
					id: layerData.id,
					balloon: rect.balloon,
					...newPosition,
				})
			},
			onPanResponderRelease: (e, gesture) => {
				if (this.state.isActivePanReponderTailBalloon === true) {
					return
				}
				const { motionCaptureData } = this.props
				if (motionCaptureData.state === "playing") {
					return
				}
				const {
					layerData, isSelected, actions,
				} = this.props
				if (Math.abs(gesture.dx) < minimalDistance && Math.abs(gesture.dy) < minimalDistance) { // Simple tap (but should also depend on time...)
					actions.setSelectedLayers((isSelected === true) ? [] : [layerData.id])
				} else if (motionCaptureData.state === "recording") { // Motion capture
					actions.stopMotionCapture(this.motionCaptureArray)
				} else { // Translation
					const newPosition = this.getUpdatedVariables(gesture)
					actions.updateLayerVariables(layerData.id, newPosition)
				}
			},
			onPanResponderTerminate: () => false,
			onResponderReject: () => {
				console.log("Error")
			},
		})
	}


	componentWillReceiveProps(nextProps) {
		const { isSelected, updatingData, motionCaptureData } = nextProps
		if (isSelected === false) {
			return
		}
		if (motionCaptureData.state === "playing") {
			if (this.props.motionCaptureData.state === "recording") {
				this.processMotionCaptureArray(motionCaptureData.array)
				this.playAnimation(motionCaptureData.duration)
			} else if (updatingData.duration
				&& updatingData.duration !== this.props.updatingData.duration) {
				this.playAnimation(updatingData.duration)
			}
		} else if (motionCaptureData.state === "inactive"
			&& this.props.motionCaptureData.state === "playing") {
			this.setState({
				inputRange: [],
				xOutputRange: [],
				yOutputRange: [],
			}, () => this.progress.stopAnimation())
		}
	}

	getUpdatedVariables = (gesture) => {
		const { scale, layerData } = this.props
		const updatedVariables = {
			x: (layerData.x || 0) + gesture.dx / scale,
			y: (layerData.y || 0) + gesture.dy / scale,
		}
		return updatedVariables
	}

	processMotionCaptureArray = (motionCaptureArray) => {
		let totalDistance = 0
		let lastPoint
		const array = [...motionCaptureArray]
		array.forEach((point, i) => {
			if (i === 0) {
				lastPoint = point
				point.distance = 0
			} else {
				const newDistance = this.computeDistance(point, lastPoint)
				totalDistance += newDistance
				point.distance = totalDistance
				lastPoint = point
			}
		})
		const inputRange = []
		const xOutputRange = []
		const yOutputRange = []
		if (totalDistance > 0) {
			array.forEach((point) => {
				const percent = point.distance / totalDistance
				inputRange.push(percent)
				xOutputRange.push(point.x)
				yOutputRange.push(point.y)
			})
		}
		this.setState({ inputRange, xOutputRange, yOutputRange })
	}

	computeDistance = (point1, point2) => (
		Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
	)

	playAnimation = (duration) => {
		let stopValue = 0
		this.progress.stopAnimation((value) => { stopValue = value })
		Animated.sequence(
			[
				Animated.timing(
					this.progress,
					{
						toValue: 1,
						duration: (1 - stopValue) * duration,
						easing: Easing.linear,
						//useNativeDriver: true, // If uncommented, the stopValue above will always be zero!
					},
				),
				Animated.timing(
					this.progress,
					{
						toValue: 0,
						duration: 0,
						easing: Easing.linear,
						//useNativeDriver: true, // If uncommented, the stopValue above will always be zero!
					},
				),
				Animated.loop(
					Animated.timing(
						this.progress,
						{
							toValue: 1,
							duration,
							easing: Easing.linear,
							//useNativeDriver: true, // If uncommented, the stopValue above will always be zero!
						},
					),
				),
			],
		).start()
	}

	togglePanReponderTailBalloon = () => {
		this.setState({ isActivePanReponderTailBalloon: !this.state.isActivePanReponderTailBalloon })
	}

	render() {
		const {
			layerData, rect, isSelected, stageSize, handleUpdatingData, handleUpdatingDataBalloon,
			updatingDataBalloon, balloonData, scale
		} = this.props
		const { inputRange, xOutputRange, yOutputRange } = this.state
		const { width, height } = rect
		const style = {
			position: "absolute",
			...rect,
		}
		if (inputRange.length > 1) {
			style.transform = [ // Can we use this.progress.getTranslateTransform()?
				{
					translateX: this.progress.interpolate({
						inputRange,
						outputRange: xOutputRange,
					}),
				},
				{
					translateY: this.progress.interpolate({
						inputRange,
						outputRange: yOutputRange,
					}),
				},
			]
		}
		return (
			<Animated.View
				pointerEvents="box-none"
				style={
					{
						...style,
						//transform: [{ rotate: `${rect.r}deg` }]
					}
				}
			>
				{
					(layerData.src)
						? (
							<Image
								style={
									{
										width,
										height,
										transform: [{ rotate: `${rect.r}deg` }],
									}
								}
								resizeMode="stretch"
								source={ { uri: layerData.src } }
								{ ...this.panResponder.panHandlers }
							/>
						)
						: null
				}
				{
					(layerData.balloon)
						? (
							<View { ...this.panResponder.panHandlers }>
								<Balloon
									scale={ scale }
									rect={ rect }
									isSelected={ isSelected }
									balloonData={ balloonData }
									handleUpdatingDataBalloon={ handleUpdatingDataBalloon }
									togglePanReponderTailBalloon={ this.togglePanReponderTailBalloon }
									stageSize={ stageSize }
								/>
							</View>
						)
						: null
				}
			</Animated.View>
		)
	}

}

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch),
})
Layer = connect(null, mapDispatchToProps)(Layer)

Layer.propTypes = {
	stageSize: PropTypes.object.isRequired,
	scale: PropTypes.number.isRequired,
	rect: PropTypes.object.isRequired,
	layerData: PropTypes.object.isRequired,
	balloonData: PropTypes.object.isRequired,
	isSelected: PropTypes.bool.isRequired,
	updatingData: PropTypes.object,
	handleUpdatingDataBalloon: PropTypes.func.isRequired,
	motionCaptureData: PropTypes.object.isRequired,
	actions: PropTypes.object,
}

export default Layer
