import React, { Component } from "react"
import { View } from "react-native"
import PropTypes from "prop-types"

import ColorPicker from "src/components/ColorPicker"
import BorderSize from "./components/BorderSize"
import FontNameSelect from "./components/FontNameSelect"
import FontSizeSelect from "./components/FontSizeSelect"
import BorderRadius from "./components/BorderRadius"

class Option extends Component {

	updateTextStyle = (key, value) => {
		const { handleUpdatingDataBalloon, selectedBalloonData } = this.props
		const newBalloonData = {
			...selectedBalloonData.balloon,
			textStyle: {
				...selectedBalloonData.balloon.textStyle,
				[key]: value,
			},
		}
		handleUpdatingDataBalloon({
			elementId: selectedBalloonData.elementId,
			id: selectedBalloonData.id,
			balloon: newBalloonData,
		})
	}

	updateDrawingStyle = (key, value) => {
		const { handleUpdatingDataBalloon, selectedBalloonData } = this.props
		const newBalloonData = {
			...selectedBalloonData.balloon,
			drawingStyle: {
				...selectedBalloonData.balloon.drawingStyle,
				[key]: value,
			},
		}
		handleUpdatingDataBalloon({
			elementId: selectedBalloonData.elementId,
			id: selectedBalloonData.id,
			balloon: newBalloonData,
		})
	}

	render() {
		const { isActiveOption, selectedBalloonData } = this.props
		const { textStyle, drawingStyle } = selectedBalloonData.balloon
		return (
			<View>
				{
					(isActiveOption === "FontName")
						? (
							<FontNameSelect
								updateTextStyle={ (value) => this.updateTextStyle("fontName", value) }
								fontName={ textStyle.fontName || "" }
							/>
						)
						: null
				}
				{
					(isActiveOption === "FontSize")
						? (
							<FontSizeSelect
								updateTextStyle={ this.updateTextStyle }
								fontSize={ textStyle.fontSize || 1 }
							/>
						)
						: null
				}
				{
					(isActiveOption === "TextColor")
						? (
							<ColorPicker
								updateData={ this.updateTextStyle }
								propertyCss="color"
							/>
						)
						: null
				}
				{
					(isActiveOption === "backgroundColor")
						? (
							<ColorPicker
								updateData={ this.updateDrawingStyle }
								propertyCss="backgroundColor"
							/>
						)
						: null
				}
				{
					(isActiveOption === "BorderWidth")
						? (
							<BorderSize
								updateDrawingStyle={ this.updateDrawingStyle }
								borderWidth={ drawingStyle.borderWidth || 1 }
							/>
						)
						: null
				}
				{
					(isActiveOption === "BorderColor")
						? (
							<ColorPicker
								updateData={ this.updateDrawingStyle }
								propertyCss="borderColor"
							/>
						)
						: null
				}
				{
					(isActiveOption === "borderRadius")
						? (
							<BorderRadius
								updateDrawingStyle={ this.updateDrawingStyle }
								borderRadius={ drawingStyle.borderRadius || 1 }
							/>
						)
						: null
				}
			</View>
		)
	}

}

Option.propTypes = {
	isActiveOption: PropTypes.string.isRequired,
	selectedBalloonData: PropTypes.object.isRequired,
	handleUpdatingDataBalloon: PropTypes.func.isRequired,
}

export default Option
