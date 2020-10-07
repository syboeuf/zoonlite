import React, { Component } from "react"
import {
	StyleSheet, View, TouchableOpacity, Slider, Text, PanResponder, Animated, Easing,
} from "react-native"
import PropTypes from "prop-types"

import { bindActionCreators } from "redux"
import * as Actions from "src/actions/editor"
import { connect } from "react-redux"

import * as constants from "src/constants/constants"

import ButtonOptions from "./components/ButtonOptions"

const durationForLayerInspectorAnimation = 250

const styles = StyleSheet.create({
	wrapper: {
		position: "absolute",
		overflow: "hidden",
		backgroundColor: "red",
	},
	buttons: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	buttonValidateOption: {
		backgroundColor: "blue",
		width: 60,
		height: 20,
	},
})

class LayerInspector extends Component {

	componentWillMount() {
		this.bottomPosition = new Animated.Value(-constants.LAYER_INSPECTOR_PORTRAIT_HEIGHT)
		this.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onStartShouldSetResponderCapture: () => false,
			onMoveShouldSetPanResponder: (e, gesture) => {
				if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
					return false
				}
				return true
			},
			onMoveShouldSetPanResponderCapture: () => false,
			onPanResponderMove: (e, gesture) => {
				if (gesture.dy > 0) {
					this.animationLayerInspector(-gesture.dy, 0)
				}
			},
			onPanResponderRelease: (e, gesture) => {
				if (gesture.dy >= this.layerInspectorHeight / 2) {
					this.animationLayerInspector(-constants.LAYER_INSPECTOR_PORTRAIT_HEIGHT,
						durationForLayerInspectorAnimation / 2)
				} else {
					this.animationLayerInspector(0,
						durationForLayerInspectorAnimation / 2)
				}
			},
		})
	}

	componentWillReceiveProps(nextProps) {
		const { layerData } = nextProps
		if (layerData.id) {
			this.animationLayerInspector(0, durationForLayerInspectorAnimation)
		} else {
			this.animationLayerInspector(-constants.LAYER_INSPECTOR_PORTRAIT_HEIGHT,
				durationForLayerInspectorAnimation)
		}
	}

	animationLayerInspector = (toValue, duration) => {
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
			stageSize, layerData, handleUpdatingData, actions, rect, handleUpdatingDataBalloon, selectedBalloonData,
		} = this.props
		const { width, height } = stageSize
		this.layerInspectorHeight = (width <= height)
			? constants.LAYER_INSPECTOR_PORTRAIT_HEIGHT
			: constants.LAYER_INSPECTOR_LANDSCAPE_HEIGHT
		return (
			<Animated.View
				{ ...this.panResponder.panHandlers }
				style={
					{
						...styles.wrapper,
						bottom: this.bottomPosition,
						width,
						height: this.layerInspectorHeight,
					}
				}
			>
				<Slider
					value={ (layerData.o !== undefined) ? layerData.o : 1 }
					onValueChange={ (value) => handleUpdatingData({ id: layerData.id, o: value }) }
					onSlidingComplete={ (value) => actions.updateLayerVariables(layerData.id, { o: value }) }
				/>
				<View style={ styles.buttons }>
					<TouchableOpacity onPressIn={ () => actions.moveBackward(layerData.id) }>
						<Text>Backward</Text>
					</TouchableOpacity>
					<TouchableOpacity onPressIn={ () => actions.moveForward(layerData.id) }>
						<Text>Forward</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPressIn={ () => actions.startMotionCapture(layerData.id) }>
					<Text style={ { textAlign: "center" } }>Motion Capture</Text>
				</TouchableOpacity>
				{
					(layerData.balloon)
						? (
							<View style={ { justifyContent: "center" } }>
								<ButtonOptions
									handleUpdatingDataBalloon={ handleUpdatingDataBalloon }
									selectedBalloonData={ selectedBalloonData }
								/>
							</View>
						)
						: null
				}
			</Animated.View>
		) // BUTTON FOR MOTION CAPTURE COULD ALSO BE USED TO STOP IT!!!
	}

}

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch),
})
LayerInspector = connect(null, mapDispatchToProps)(LayerInspector)

LayerInspector.propTypes = {
	stageSize: PropTypes.object.isRequired,
	layerData: PropTypes.object.isRequired,
	handleUpdatingData: PropTypes.func.isRequired,
	handleUpdatingDataBalloon: PropTypes.func.isRequired,
	rect: PropTypes.object,
	actions: PropTypes.object,
}

export default LayerInspector
