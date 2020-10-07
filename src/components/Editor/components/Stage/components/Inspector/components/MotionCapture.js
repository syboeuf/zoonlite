import React, { Component } from "react"
import {
	Slider, View, TouchableOpacity, Text, Animated, Easing, StyleSheet,
} from "react-native"
import PropTypes from "prop-types"

import { bindActionCreators } from "redux"
import * as Actions from "src/actions/editor"
import { connect } from "react-redux"

import * as constants from "src/constants/constants"

const durationForMotionCaptureAnimation = 250
const minD = 100
const maxD = 4000

const styles = StyleSheet.create({
	wrapper: {
		position: "absolute",
		justifyContent: "center",
		overflow: "hidden",
		backgroundColor: "blue",
	},
	buttons: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
})

class MotionCapture extends Component {

	componentWillMount() {
		this.bottomPosition = new Animated.Value(-constants.MOTION_CAPTURE_PORTRAIT_HEIGHT)
		this.animationMotionCapture(0, durationForMotionCaptureAnimation)
	}

	animationMotionCapture = (toValue, duration) => {
		Animated.timing(
			this.bottomPosition,
			{
				toValue,
				duration,
				easing: Easing.linear,
			},
		).start()
	}

	processDuration = (duration) => ((maxD - duration) / (maxD - minD))

	processValue = (value) => ((maxD - (maxD - minD) * value))

	render() {
		const {
			stageSize, motionCaptureData, handleUpdatingData, actions,
		} = this.props
		const { width, height } = stageSize
		this.motionCaptureHeight = (width <= height)
			? constants.MOTION_CAPTURE_PORTRAIT_HEIGHT
			: constants.MOTION_CAPTURE_LANDSCAPE_HEIGHT
		const value = this.processDuration(motionCaptureData.duration)
		return (
			<Animated.View
				style={
					{
						...styles.wrapper,
						bottom: this.bottomPosition,
						width,
						height: this.motionCaptureHeight,
					}
				}
			>
				<Slider
					value={ value }
					onValueChange={ (newValue) => {
						if (Math.abs(newValue - value) > 0.05) {
							requestAnimationFrame(() => handleUpdatingData({ duration: this.processValue(newValue) }))
						}
					} }
					onSlidingComplete={ (newValue) => actions.updateLayerVariables(motionCaptureData.layerId,
						{ motionCaptureData: { duration: this.processValue(newValue), array: motionCaptureData.array } })
					}
				/>
				<View style={ styles.buttons }>
					<TouchableOpacity
						onPress={ () => {
							console.log("Cancel")
							actions.quitMotionCapture([])
						} }
					>
						<Text>Cancel</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={ () => {
							actions.quitMotionCapture(motionCaptureData)
							this.animationMotionCapture(-constants.MOTION_CAPTURE_PORTRAIT_HEIGHT, durationForMotionCaptureAnimation)
						} }
					>
						<Text>Validate</Text>
					</TouchableOpacity>
				</View>
			</Animated.View>
		)
	}

}

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch),
})
MotionCapture = connect(null, mapDispatchToProps)(MotionCapture)

MotionCapture.propTypes = {
	stageSize: PropTypes.object.isRequired,
	motionCaptureData: PropTypes.object,
	handleUpdatingData: PropTypes.func.isRequired,
	actions: PropTypes.object,
}

export default MotionCapture
