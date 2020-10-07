import React, { Component } from "react"
import {
	StyleSheet, View, ScrollView, TouchableOpacity, Text, InteractionManager,
} from "react-native"
import PropTypes from "prop-types"
import SortableList from "react-native-sortable-list"

import { bindActionCreators } from "redux"
import * as Actions from "src/actions/editor"
import { connect } from "react-redux"

import * as constants from "src/constants/constants"
import Row from "./components/Row"

const styles = StyleSheet.create({
	container: {
		paddingTop: 10,
		paddingBottom: 10,
		alignItems: "center",
		backgroundColor: "grey",
	},
	text: {
		fontSize: 20,
		textAlign: "center",
	},
	thumbnail: {
		borderWidth: 2,
		width: constants.THUMBNAIL_WIDTH,
		height: constants.THUMBNAIL_HEIGHT,
		marginLeft: constants.THUMBNAIL_MARGIN / 2,
		marginRight: constants.THUMBNAIL_MARGIN / 2,
		justifyContent: "center",
		backgroundColor: "white",
	},
})

class PageList extends Component {

	constructor(props) {
		super(props)
		this.state = { isInListEditMode: false }
	}

	componentDidMount() {
		const { pageIds, currentPageId } = this.props
		if (currentPageId) {
			InteractionManager.runAfterInteractions(() => {
				this.scrollToIndex(pageIds.indexOf(currentPageId), true)
	    	})
		}
	}

	componentWillReceiveProps(nextProps) {
		const { currentPageId, pageIds } = nextProps
		if (currentPageId !== this.props.currentPageId) {
			InteractionManager.runAfterInteractions(() => {
				this.scrollToIndex(pageIds.indexOf(currentPageId), true)
			})
		}
	}

	renderRow = ({ data, index, active }) => (
		<Row
			data={ data }
			index={ index }
			active={ active }
			//pageIds={ pageIds }
			//currentPageId={ currentPageId }
			scrolling={ this.scrollToIndex }
		/>
	)

	scrollToIndex = (index, shouldAnimate) => {
		const x = constants.THUMBNAIL_MARGIN / 2 + index * (constants.THUMBNAIL_WIDTH + constants.THUMBNAIL_MARGIN)
		this.scroller.scrollTo({ x, y: 0, animated: shouldAnimate })
	}

	render() {
		const {
			stageSize, pageIds, currentPageId, actions,
		} = this.props
		const { isInListEditMode } = this.state
		const padding = stageSize.width / 2 - constants.THUMBNAIL_WIDTH / 2
		const listStyle = {
			paddingLeft: padding,
			paddingRight: padding,
		}
		return (
			<View style={ styles.container }>
				{
					(isInListEditMode === true)
						? (
							<SortableList
								ref={ (node) => { this.scroller = node } }
								style={ { height: constants.THUMBNAIL_HEIGHT } }
								contentContainerStyle={ listStyle }
								horizontal={ true }
								showsHorizontalScrollIndicator={ false }
								data={ pageIds }
								renderRow={ this.renderRow }
								onPressRow={ () => this.setState({ isInListEditMode: false }) }
							/>
						)
						: (
							<ScrollView
								ref={ (node) => { this.scroller = node } }
								contentContainerStyle={ listStyle }
								horizontal={ true }
								showsHorizontalScrollIndicator={ false }
								on={ true }
							>
								{
									pageIds.map((pageId) => (
										<TouchableOpacity
											key={ `page-${pageId}` }
											style={
												{
													...styles.thumbnail,
													borderColor: (currentPageId === pageId) ? "red" : null,
												}
											}
											onLongPress={ () => this.setState({ isInListEditMode: true }) }
											onPress={ () => actions.goToPageWithId(pageId) }
										>
											<Text style={ styles.text }>
												{ pageId }
											</Text>
										</TouchableOpacity>
									))
								}
							</ScrollView>
						)
				}
			</View>
		)
	}

}

const mapStateToProps = (state) => {
	const { ui, project } = state.editor
	const { pageIds } = project.projectData.story
	const { currentPageId } = ui
	return { pageIds, currentPageId }
}
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators(Actions, dispatch),
})
PageList = connect(mapStateToProps, mapDispatchToProps)(PageList)

PageList.propTypes = {
	stageSize: PropTypes.object.isRequired,
	pageIds: PropTypes.arrayOf(PropTypes.string.isRequired),
	currentPageId: PropTypes.string,
	actions: PropTypes.object,
}

export default PageList
