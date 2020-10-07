import React, { Component } from "react"
import { View, FlatList } from "react-native"
import PropTypes from "prop-types"

import { bindActionCreators } from "redux"
import * as Actions from "src/actions/editor"
import { connect } from "react-redux"

import ItemLayer from "./components/ItemLayer"

import * as constants from "src/constants/constants"

const distanceBetweenThumbnail = 10

class PageInspector extends Component {

    scrollToIndex = (params) => {
        this.scroller.scrollToIndex(params)
    }

    itemSeparatorComponent = () => (
        <View style={ { width: constants.PAGE_INSPECTOR_THUMBNAIL_WIDTH, height: distanceBetweenThumbnail } } />
    )

    renderItem = ({ item, index }) => {
        const { actions, selectedLayerIds } = this.props
        return (
            <ItemLayer
                index={ index }
                data={ (item.text) ? item.text : item.src }
                scroll={ this.scrollToIndex }
                selectedLayerIds={ selectedLayerIds }
                setSelectedLayers={ actions.setSelectedLayers }
                id={ item.id }
                balloon={ (item.text) ? true : false }
            />
        )
    }

    render() {
        const { layerDataArray, stageSize } = this.props
        const dataArray = []
        layerDataArray.map((layerData) => {
            let data = {}
            if (layerData.balloon) {
                data = {
                    id: layerData.id,
                    text: layerData.balloon.text,
                }
            } else {
                data = {
                    id: layerData.id,
                    src: layerData.src,
                }
            }
            dataArray.push(data)
        })
        return (
            <View>
                <FlatList
                    ref={ (node) => { this.scroller = node } }
                    data={ dataArray }
                    ItemSeparatorComponent={ this.itemSeparatorComponent }
                    keyExtractor={ (item, index) => index.toString() }
                    contentContainerStyle={
                        {
                            height: dataArray.length * distanceBetweenThumbnail + (dataArray.length + 1) * constants.PAGE_INSPECTOR_THUMBNAIL_HEIGHT,
                        }
                    }
                    renderItem={ this.renderItem }
                />
            </View>
        )
    }

}

const mapStateToProps = (state) => {
    const { selectedLayerIds } = state.editor.ui
	return { selectedLayerIds }
}
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(Actions, dispatch)
})
PageInspector = connect(mapStateToProps, mapDispatchToProps)(PageInspector)

PageInspector.propTypes = {
    stageSize: PropTypes.object.isRequired,
    layerDataArray: PropTypes.arrayOf(PropTypes.object).isRequired,
    actions: PropTypes.object,
    selectedLayerIds: PropTypes.arrayOf(PropTypes.string),
}

export default PageInspector
