import React, { Component } from "react"
import { View, StyleSheet } from "react-native"
import PropTypes from "prop-types"

import BottomBar from "./components/BottomBar"
import MotionCapture from "./components/MotionCapture"
import PageInspector from "./components/PageInspector"
import LayerInspector from "./components/LayerInspector"

import * as constants from "src/constants/constants"

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        backgroundColor: "blue",
    },
    bottomBar: {
		height: constants.BOTTOM_BAR_HEIGHT,
	},
})

const Inspector = ({
    stageSize, rect, layerData, selectedBalloonData, handleUpdatingDataBalloon,
    handleUpdatingData, layerDataArray, motionCaptureData,
}) => (
    <View
        style={
            {
                ...styles.container,
                width: stageSize.width,
                height: (stageSize.width >= stageSize.height) ? constants.PAGE_INSPECTOR_LANDSCAPE_HEIGHT : constants.PAGE_INSPECTOR_PORTRAIT_HEIGHT,
            }
        }
    >
        <View style={ styles.bottomBar }>
            <BottomBar stageSize={ stageSize } />
        </View>
        <PageInspector
            layerDataArray={ layerDataArray }
            stageSize={ stageSize }
        />
        <LayerInspector
            stageSize={ stageSize }
            rect={ rect }
            layerData={ layerData }
            selectedBalloonData={ selectedBalloonData }
            handleUpdatingDataBalloon={ handleUpdatingDataBalloon }
            handleUpdatingData={ handleUpdatingData }
        />
        {
            (motionCaptureData.state === "playing")
                ? (
                    <MotionCapture
                        stageSize={ stageSize }
                        motionCaptureData={ motionCaptureData }
                        handleUpdatingData={ handleUpdatingData }
                    />
                )
                : null
        }
    </View>
)

Inspector.propTypes = {
    stageSize: PropTypes.object.isRequired,
    rect: PropTypes.object,
    layerData: PropTypes.object.isRequired,
    selectedBalloonData: PropTypes.object.isRequired,
    handleUpdatingDataBalloon: PropTypes.func.isRequired,
    handleUpdatingData: PropTypes.func.isRequired,
    layerDataArray: PropTypes.arrayOf(PropTypes.object).isRequired,
	motionCaptureData: PropTypes.object.isRequired,
}

export default Inspector
