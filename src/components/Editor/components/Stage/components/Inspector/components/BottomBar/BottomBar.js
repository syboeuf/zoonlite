import React, { Component } from "react"
import {
	StyleSheet, View, TouchableOpacity, Modal, Alert, Text, Image,
} from "react-native"
import PropTypes from "prop-types"
import ImagePicker from "react-native-image-picker"

import { bindActionCreators } from "redux"
import * as Actions from "src/actions/editor"
import { connect } from "react-redux"

import imageGalleryArray from "src/utils/ImageGallery"
import SvgIcon from "src/components/SvgIcon"
import CollectionView from "src/components/CollectionView"
import ImageCard from "./components/ImageCard"

const maxCardWidth = 500
const defaultCardSpacing = 10
const resolutionWidth = 1920
const resolutionHeight = 1080

const options = {
	quality: 0.1,
}

const buttonsArray = [
	{ name: "Camera", path: "M18 4l-3.66 4H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4h-6.34L30 4H18zm6 30c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10z" },
	{ name: "Camera roll", path: "M28 10c0-2.21-1.79-4-4-4h-2V4c0-1.1-.9-2-2-2h-8c-1.1 0-2 .9-2 2v2H8c-2.21 0-4 1.79-4 4v30c0 2.21 1.79 4 4 4h16c2.21 0 4-1.79 4-4h16V10H28zm-4 26h-4v-4h4v4zm0-18h-4v-4h4v4zm8 18h-4v-4h4v4zm0-18h-4v-4h4v4zm8 18h-4v-4h4v4zm0-18h-4v-4h4v4z" },
	{ name: "ImageGallery", path: "M42 38V10c0-2.21-1.79-4-4-4H10c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4zM17 27l5 6.01L29 24l9 12H10l7-9z" },
	{ name: "Transition", path: "M46 16c0 2.2-1.8 4-4 4-.36 0-.7-.04-1.02-.14l-7.12 7.1c.1.32.14.68.14 1.04 0 2.2-1.8 4-4 4s-4-1.8-4-4c0-.36.04-.72.14-1.04l-5.1-5.1c-.32.1-.68.14-1.04.14s-.72-.04-1.04-.14l-9.1 9.12c.1.32.14.66.14 1.02 0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.36 0 .7.04 1.02.14l9.12-9.1c-.1-.32-.14-.68-.14-1.04 0-2.2 1.8-4 4-4s4 1.8 4 4c0 .36-.04.72-.14 1.04l5.1 5.1c.32-.1.68-.14 1.04-.14s.72.04 1.04.14l7.1-7.12c-.1-.32-.14-.66-.14-1.02 0-2.2 1.8-4 4-4s4 1.8 4 4z" },
	{ name: "Text", path: "M10 34v4h28v-4H10zm9-8.4h10l1.8 4.4H35L25.5 8h-3L13 30h4.2l1.8-4.4zm5-13.64L27.74 22h-7.48L24 11.96z" },
	{ name: "Record", path: "M34 21v-7c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h24c1.1 0 2-.9 2-2v-7l8 8V13l-8 8z" },
]

const styles = StyleSheet.create({
	bar: {
		position: "absolute",
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-around",
		width: "100%",
		backgroundColor: "grey",
	},
	modal: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20,
	},
})

class BottomBar extends Component {

	constructor(props) {
		super(props)
		this.state = { showImageGallery: false }
	}

	selectButton = (name) => {
		switch (name) {
		case "Camera":
			this.launchCamera()
			break

		case "Camera roll":
			this.launchImageLibrary()
			break

		case "ImageGallery":
			this.setState({ showImageGallery: true })
			break

		case "Text":
			const { actions } = this.props
			actions.addBalloonToPage()
			break
		default:
			break

		}
	}

	addImageToPage = (imageData) => {
		const { actions } = this.props
		this.setState({ showImageGallery: false },
			() => actions.addResourceToPage(imageData))
	}

	launchCamera = () => {
		const { actions, stageSize } = this.props
		ImagePicker.launchCamera(options, (response) => {
			let width
			let height
			if (response.isVertical === true) {
				width = resolutionWidth
				height = (resolutionWidth / response.width) * response.height
			} else {
				width = (resolutionHeight / response.height) * response.width
				height = resolutionHeight
			}
			if (response.didCancel) {
				console.log("The user is cancel")
			} else if (response.error) {
				console.log("Error : ", response.error)
			} else {
				actions.addResourceToPage({
					src: "data:image/jpeg;base64," + response.data,
					w: width,
					h: height,
				})
			}
		})
	}

	launchImageLibrary = () => {
		const { actions, stageSize } = this.props
		ImagePicker.launchImageLibrary(options, (response) => {
			if (response.didCancel) {
				console.log("The user is cancel")
			} else if (response.error) {
				console.log("Error : ", response.error)
			} else {
				actions.addResourceToPage({ src: "data:image/jpeg;base64," + response.data })
			}
		})
	}

	renderItem = (src, size) => (
		<ImageCard
			src={ src }
			size={ size }
			addImageToPage={ this.addImageToPage }
		/>
	)

	render() {
		const { stageSize } = this.props
		const { showImageGallery } = this.state
		return (
			<View style={ styles.bar }>
				{
					buttonsArray.map((button) => (
						<TouchableOpacity
							key={ `button-${button.name}` }
							onPress={ () => this.selectButton(button.name) }
						>
							<SvgIcon path={ button.path } />
						</TouchableOpacity>
					))
				}
				{
					(showImageGallery === true)
						? (
							<View>
								<Modal
									visible={ (showImageGallery === true) }
									animation="none"
									onRequestClose={ () => {
										Alert.alert("Modal has been closed")
									} }
								>
									<View style={ styles.modal }>
										<TouchableOpacity
											onPress={ () => this.setState({ showImageGallery: false }) }
										>
											<Text>Close modal</Text>
										</TouchableOpacity>
										<CollectionView
											data={ imageGalleryArray }
											renderItem={ this.renderItem }
											size={ stageSize }
											maxCardWidth={ maxCardWidth }
											cardSpacing={ defaultCardSpacing }
										/>
									</View>
								</Modal>
							</View>
						)
						: null
				}
			</View>
		)
	}

}

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch),
})
BottomBar = connect(null, mapDispatchToProps)(BottomBar)

BottomBar.propTypes = {
	stageSize: PropTypes.object.isRequired,
	actions: PropTypes.object,
}

export default BottomBar
