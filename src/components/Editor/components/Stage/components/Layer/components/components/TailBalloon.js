import React, { Component } from "react"
import { View, PanResponder } from "react-native"
import PropTypes from "prop-types"
import Svg, { Polygon, Rect } from "react-native-svg"
// if we use expo use this: import { Svg } from "expo"

import { bindActionCreators } from "redux"
import * as Actions from "src/actions/editor"
import { connect } from "react-redux"

// if we use expo use this: const { Polygon } = Svg

const widthButtonToRotateAndResize = 20
const initialWidthHeightTailBalloon = 50

class TailBalloon extends Component {

	constructor(props) {
		super(props)
		this.state = {
			pointA: [0, 0],
			pointB: [0, 0],
			pointC: [0, 0],
		}
	}

	componentWillMount() {
		this.panResponder = PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onStartShouldSetResponderCapture: () => true,
			onMoveShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponderCapture: () => true,
			onPanResponderGrant: (e, gesture) => {
				const { togglePanReponderTailBalloon } = this.props
				togglePanReponderTailBalloon()
			},
			onPanResponderMove: (e, gesture) => {
				const { rect, stageSize } = this.props
				const x = rect.left + rect.width / 2
				const y = rect.top + rect.height / 2
				const deltaX = gesture.moveX - x
				const deltaY = gesture.moveY - stageSize.heightBar - y
				const angle = Math.atan2(deltaX, -deltaY) - Math.PI
				this.newPosition(angle, gesture)
			},
			onPanResponderRelease: () => {
				const { togglePanReponderTailBalloon, actions, balloonData } = this.props
				const { pointA, pointB, pointC } = this.state
				togglePanReponderTailBalloon()
				const tailData = {
					...balloonData.balloon,
					tail: { pointA, pointB, pointC }
				}
				actions.updateballoonDataVariables(balloonData.elementId, tailData)
			},
		})
	}

	componentDidMount() {
		const { rect, balloonData, actions } = this.props
		if (balloonData.balloon.tail) {
			const { pointA, pointB, pointC } = balloonData.balloon.tail
			this.setState({ pointA, pointB, pointC })
		} else {
			this.setState({
				pointA: [rect.width / 2 - rect.width / 4, rect.height / 2],
				pointB: [rect.width / 2 + rect.width / 4, rect.height / 2],
				pointC: [rect.width / 2, rect.height * 1.5],
			}, () => {
				const tailData = {
					...balloonData.balloon,
					tail: {
						pointA: [rect.width / 2 - rect.width / 4, rect.height / 2],
						pointB: [rect.width / 2 + rect.width / 4, rect.height / 2],
						pointC: [rect.width / 2, rect.height * 1.5],
					}
				}
				actions.updateballoonDataVariables(balloonData.elementId, tailData)
			})
		}
	}

	newPosition = (angle, gesture) => {
		const { rect, stageSize } = this.props
		const xa = rect.width / 2 - rect.width / 4
		const ya = rect.height / 2
		const xb = rect.width / 2 + rect.width / 4
		const yb = rect.height / 2
		const xc = gesture.moveX - rect.left
		const yc = gesture.moveY - stageSize.heightBar - rect.top
		const originPointX = rect.width / 2
		const originPointY = rect.height / 2
		this.setState({
			pointA: this.calculCoordinate(xa, ya, angle, originPointX, originPointY),
			pointB: this.calculCoordinate(xb, yb, angle, originPointX, originPointY),
			pointC: [xc, yc],
		})
	}

	calculCoordinate = (x, y, angle, originPointX, originPointY) => {
		const pointX = Math.cos(angle) * (x - originPointX) - Math.sin(angle) * (y - originPointY)
		const pointY = Math.sin(angle) * (x - originPointX) + Math.cos(angle) * (y - originPointY)
		return [pointX + originPointX, pointY + originPointY]
	}

	render() {
		const {
			balloonData, isSelected, rect, stageSize,
		} = this.props
		const { drawingStyle } = balloonData.balloon
		const { pointA, pointB, pointC } = this.state
		return (
			<View>
				<View style={ { top: -rect.top, left: -rect.left } }>
					<Svg
						pointerEvents="box-none"
						width={ stageSize.width }
						height={ stageSize.height }
					>
						<Rect
							x={ rect.left }
							y={ rect.top }
							width={ rect.width }
							height={ rect.height }
							rx={ drawingStyle.borderRadius }
							ry={ drawingStyle.borderRadius }
							fill={ drawingStyle.backgroundColor }
							stroke={ drawingStyle.borderColor }
							strokeWidth={ drawingStyle.borderWidth }
						/>
						<Polygon
							points={
								`${rect.left + pointA[0]}, ${rect.top + pointA[1]}
								${rect.left + pointB[0]}, ${rect.top + pointB[1]}
								${rect.left + pointC[0]}, ${rect.top + pointC[1]}`
							}
							fill={ drawingStyle.backgroundColor }
							stroke={ drawingStyle.borderColor }
							strokeWidth={ drawingStyle.borderWidth }
						/>
						<Rect
							x={ rect.left + 1 }
							y={ rect.top + 1 }
							width={ rect.width - 2 }
							height={ rect.height - 2 }
							rx={ drawingStyle.borderRadius }
							ry={ drawingStyle.borderRadius }
							fill={ drawingStyle.backgroundColor }
							stroke="transparent"
							strokeWidth={ drawingStyle.borderWidth }
						/>
					</Svg>
					{
						(isSelected)
							? (
								<View
									{ ...this.panResponder.panHandlers }
									style={
										{
											position: "absolute",
											width: widthButtonToRotateAndResize,
											height: widthButtonToRotateAndResize,
											borderRadius: widthButtonToRotateAndResize,
											backgroundColor: "black",
											left: rect.left + pointC[0] - widthButtonToRotateAndResize / 2,
											top: rect.top + pointC[1] - widthButtonToRotateAndResize / 2,
										}
									}
								/>
							)
							: null
					}
				</View>
			</View>
		)
	}

}

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch),
})
TailBalloon = connect(null, mapDispatchToProps)(TailBalloon)

TailBalloon.propTypes = {
	scale: PropTypes.number.isRequired,
	togglePanReponderTailBalloon: PropTypes.func.isRequired,
	balloonData: PropTypes.object.isRequired,
	rect: PropTypes.object.isRequired,
	isSelected: PropTypes.bool.isRequired,
	stageSize: PropTypes.object.isRequired,
}

export default TailBalloon
