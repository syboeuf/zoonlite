import React from "react"
import {
    Image, TouchableOpacity, Text, View,
} from "react-native"
import PropTypes from "prop-types"

import * as constants from "src/constants/constants"

const borderWidth = 2

const styles = {
    image: {
        width: constants.PAGE_INSPECTOR_THUMBNAIL_WIDTH,
        height: constants.PAGE_INSPECTOR_THUMBNAIL_HEIGHT,
        borderWidth,
    },
}

const ItemLayer = ({
    data, index, id, scroll, setSelectedLayers, selectedLayerIds, balloon,
}) => (
    <TouchableOpacity
        onPress={ () => {
            scroll({
                index,
                animated: false,
                viewOffset: 0,
                viewPosition: 0.5,
            })
            setSelectedLayers((selectedLayerIds[0] === id) ? [] : [id])
        } }
    >
        {
            (balloon === false)
                ? (
                    <Image
                        style={
                            {
                                ...styles.image,
                                borderColor: (selectedLayerIds[0] === id) ? "red" : "black",
                            }
                        }
                        source={ { uri: data } }
                    />
                )
                : <View
                    style={
                        {
                            ...styles.image,
                            backgroundColor: "white",
                            justifyContent: "center",
                            borderColor: (selectedLayerIds[0] === id) ? "red" : "black",
                        }
                    }
                >
                    <Text style={ { textAlign: "center" } }>
                        { data || "" }
                    </Text>
                </View>
        }
    </TouchableOpacity>
)

ItemLayer.propTypes = {
    data: PropTypes.string,
    index: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    scroll: PropTypes.func.isRequired,
    setSelectedLayers: PropTypes.func.isRequired,
    selectedLayerIds: PropTypes.arrayOf(PropTypes.string),
    balloon: PropTypes.bool.isRequired,
}


export default ItemLayer
