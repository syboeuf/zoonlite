import React, { Component } from "react"
import { View, TouchableOpacity, Text } from "react-native"
import PropTypes from "prop-types"

import { bindActionCreators } from "redux"
import * as Actions from "src/actions/editor"
import { connect } from "react-redux"

import EditText from "./components/EditText"
import TailBalloon from "./components/TailBalloon"

class Balloon extends Component {

	onChangeText = (value) => {
		const { handleUpdatingDataBalloon, balloonData } = this.props
		const newBalloonData = {
			...balloonData.balloon,
			text: value,
		}
		handleUpdatingDataBalloon({
			elementId: balloonData.elementId,
			id: balloonData.id,
			balloon: newBalloonData,
		})
	}

	render() {
		const {
			rect, actions, isSelected, stageSize, togglePanReponderTailBalloon, balloonData, scale,
		} = this.props
		const { textStyle, text } = balloonData.balloon
		const balloonStyle = {
			position: "absolute",
			width: rect.width,
			height: rect.height,
			justifyContent: "center",
		}
		return (
			<View>
				{
					(isSelected === true)
						? (
							<EditText
								text={ text || "" }
								rect={ rect }
								stageSize={ stageSize }
								onChangeText={ this.onChangeText }
							/>
						)
						: null
				}
				<View style={ { position: "absolute" } }>
					<TailBalloon
						togglePanReponderTailBalloon={ togglePanReponderTailBalloon }
						isSelected={ isSelected }
						balloonData={ balloonData }
						stageSize={ stageSize }
						rect={ rect }
						scale={ scale }
					/>
				</View>
				<TouchableOpacity
					style={ balloonStyle }
					activeOpacity={ 1 }
					onPress={ () => actions.setSelectedLayers((isSelected === true) ? [] : [balloonData.id]) }
				>
					<Text
						style={
							{
								transform: [{ rotate: `${rect.r}deg` }],
								textAlign: "center",
								fontFamily: textStyle.fontFamily,
								fontSize: textStyle.fontSize,
								color: textStyle.color,
							}
						}
					>
						{ text }
					</Text>
				</TouchableOpacity>
			</View>
		)
	}

}

const mapStateToProps = (state) => {
	const { ui } = state.editor
	return { currentPageId: ui.currentPageId }
}
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch),
})
Balloon = connect(mapStateToProps, mapDispatchToProps)(Balloon)

Balloon.propTypes = {
	scale: PropTypes.number.isRequired,
	stageSize: PropTypes.object.isRequired,
	rect: PropTypes.object.isRequired,
	togglePanReponderTailBalloon: PropTypes.func.isRequired,
	balloonData: PropTypes.object.isRequired,
	isSelected: PropTypes.bool.isRequired,
	actions: PropTypes.object,
	handleUpdatingDataBalloon: PropTypes.func.isRequired,
}

export default Balloon
