import React, { Component } from "react"
import {
	StyleSheet, View, PanResponder, Alert,
} from "react-native"
import PropTypes from "prop-types"

import { bindActionCreators } from "redux"
import * as Actions from "src/actions/editor"
import { connect } from "react-redux"

const cornerButtonRadius = 10
const minDimension = 50

const styles = StyleSheet.create({
	selectRect: {
		borderWidth: 2,
		borderColor: "blue",
		backgroundColor: "rgba(0,0,255,0.25)",
	},
	cornerButton: {
		position: "absolute",
		width: cornerButtonRadius * 2,
		height: cornerButtonRadius * 2,
		borderRadius: cornerButtonRadius,
		backgroundColor: "black",
	},
})

const cornerButtonsArray = [
	{ name: "Delete", style: { top: 0, left: 0 } },
	{ name: "Rotate", style: { top: 0, right: 0 } },
	{ name: "Scale", style: { bottom: 0, right: 0 } },
	{ name: "Edit", style: { bottom: 0, left: 0 } },
]

class SelectRect extends Component {

	componentWillMount() {
		this.cornerPanResponders = {}
		this.startRotation = null
		cornerButtonsArray.forEach((button) => {
			this.cornerPanResponders[button.name] = PanResponder.create({
				onStartShouldSetPanResponder: () => true,
				onStartShouldSetPanResponderCapture: () => false,
				onMoveShouldSetPanResponder: () => true,
				onMoveShouldSetPanResponderCapture: () => true,
				onPanResponderGrant: (e, gesture) => {
					const { rect } = this.props
					if (button.name === "Delete") {
						const { layerData } = this.props
						this.removeLayer(layerData.id)
					} else if (button.name === "Rotate" && this.startRotation === null) {
						const x = rect.left + rect.width / 2
						const y = rect.top + rect.height / 2
						const radian = Math.atan2(rect.top - y, rect.left + rect.width - x)
						const degree = -radian * (180 / Math.PI)
						this.startRotation = degree
					}
				},
				onPanResponderMove: (e, gesture) => {
					if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
						return
					}
					const { layerData, handleUpdatingData, rect } = this.props
					switch (button.name) {
					case "Scale":
						const updatedVariables = this.getUpdatedVariables(gesture)
						handleUpdatingData({ id: layerData.id, ...updatedVariables })
						break
					case "Rotate":
						const degree = this.calculAngle(gesture)
						handleUpdatingData({ id: layerData.id, r: this.startRotation - degree })
						break
					default:
						break
					}
				},
				onPanResponderRelease: (e, gesture) => {
					if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
						return
					}
					const { layerData, actions, rect } = this.props
					switch (button.name) {
					case "Scale":
						const updatedVariables = this.getUpdatedVariables(gesture)
						actions.updateLayerVariables(layerData.id, updatedVariables)
						break
					case "Rotate":
						const degree = this.calculAngle(gesture)
						actions.updateLayerVariables(layerData.id, { r: this.startRotation - degree })
						break
					default:
						break
					}
				},
				onPanResponderTerminationRequest: () => true,
				onShouldBlockNativeResponder: () => false,
			})
		})
	}

	getUpdatedVariables = (gesture) => {
		const { scale, layerData } = this.props
		const scaleOffset = {
			w: Math.max(gesture.dx, minDimension - layerData.w * scale),
			h: Math.max(gesture.dy, minDimension - layerData.h * scale),
		}
		const updatedVariables = {
			w: layerData.w + scaleOffset.w / scale,
			h: layerData.h + scaleOffset.h / scale,
			x: layerData.x + scaleOffset.w / (2 * scale),
			y: layerData.y + scaleOffset.h / (2 * scale),
		}
		return updatedVariables
	}

	calculAngle = (gesture) => {
		const { rect, stageSize } = this.props
		const x = rect.left + rect.width / 2
		const y = rect.top + rect.height / 2
		const angle = Math.atan2(gesture.moveY - stageSize.heightBar - y, gesture.moveX - x)
		return -angle * (180 / Math.PI)
	}

	removeLayer = (layerId) => {
		const { actions } = this.props
		Alert.alert(
			layerId,
			"Do you want to delete this layer ?",
			[
				{ text: "Cancel", onPress: () => console.log("Cancel button pressed"), style: "cancel" },
				{ text: "OK", onPress: () => { actions.removeLayer(layerId) } },
			],
			{ cancelable: true },
		)
	}

	render() {
		const { rect } = this.props
		const {
			left, top, width, height, r,
		} = rect
		return (
			<View // Outer rectangle
				pointerEvents="box-none"
				style={
					{
						position: "absolute",
						left: left - cornerButtonRadius,
						top: top - cornerButtonRadius,
						width: width + 2 * cornerButtonRadius,
						height: height + 2 * cornerButtonRadius,
						transform: [{ rotate: `${r}deg` }],
					}
				}
			>
				<View // Inner rectangle (with colored border)
					pointerEvents="box-none"
					style={
						{
							...styles.selectRect,
							left: cornerButtonRadius,
							top: cornerButtonRadius,
							width,
							height,
						}
					}
				/>
				{ // Corner buttons
					cornerButtonsArray.map((button) => (
						<View
							key={ `cornerButton-${button.name}` }
							style={ { ...styles.cornerButton, ...button.style } }
							{ ...this.cornerPanResponders[button.name].panHandlers }
						/>
					))
				}
			</View>
		)
	}

}

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch),
})
SelectRect = connect(null, mapDispatchToProps)(SelectRect)

SelectRect.propTypes = {
	scale: PropTypes.number.isRequired,
	rect: PropTypes.object.isRequired,
	layerData: PropTypes.object.isRequired,
	handleUpdatingData: PropTypes.func.isRequired,
	actions: PropTypes.object,
	stageSize: PropTypes.object.isRequired,
}

export default SelectRect
