import shortid from "shortid"

import * as types from "src/constants/actionTypes"

import { createRawPage } from "src/utils/zoon"
import { getCurrentPage } from "src/reducers/editor"
import { updateProjectJson, addImageToProject } from "src/utils/fileProvider"

// ui

export const goToPageWithId = (pageId) => ({ type: types.GO_TO_PAGE, pageId })

export const setSelectedLayers = (layerIds) => ({ type: types.SET_SELECTED_LAYERS, layerIds })

export const startMotionCapture = (layerId) => ({
	type: types.UPDATE_MOTION_CAPTURE_DATA, data: { state: "recording", layerId, array: [] },
})

export const stopMotionCapture = (array) => ({
	type: types.UPDATE_MOTION_CAPTURE_DATA, data: { state: "playing", array },
})

export const setMotionDuration = (duration) => ({
	type: types.UPDATE_MOTION_CAPTURE_DATA, data: { duration },
})

export const quitMotionCapture = (motionCaptureData) => (
	(dispatch) => {
		dispatch({ type: types.UPDATE_MOTION_CAPTURE_DATA, data: { state: "inactive" } })
		dispatch(updateLayerVariables(motionCaptureData.layerId,
			{ motionAnimation: { duration: motionCaptureData.duration, array: motionCaptureData.array } }))
	}
)

// project

export const addPage = () => (
	(dispatch) => {
		const page = createRawPage()
		const { id } = page
		dispatch({ type: types.ADD_PAGE, page })
		dispatch(goToPageWithId(id))
	}
)

export const deletePage = (pageId) => (
	(dispatch, getState) => {
		let canDelete = true
		const { ui, project } = getState().editor
		const { currentPageId } = ui
		const { projectData } = project
		if (pageId === currentPageId) {
			const { pageIds } = projectData.story
			const pageIndex = pageIds.indexOf(pageId)
			if (pageIndex < pageIds.length - 1) {
				dispatch(goToPageWithId(pageIds[pageIndex + 1]))
			} else if (pageIndex > 0) {
				dispatch(goToPageWithId(pageIds[pageIndex - 1]))
			} else {
				canDelete = false
			}
		}
		if (canDelete === true) {
			dispatch({ type: types.DELETE_PAGE, pageId })
		}
	}
)

export const reorderPages = (oldIndex, newIndex) => ({
	type: types.REORDER_PAGES, oldIndex, newIndex,
})

// Layer

export const addResourceToPage = (resourceData) => ( // UGLY!!!
	(dispatch, getState) => {
		const currentPage = getCurrentPage(getState())
		dispatch({ type: types.START_LAYER_ADD })
		const { src, w, h } = resourceData // For now, images can only be added from ImageGallery
		addImageToProject(src)
			.then(({ width, height }) => {
				const layerId = shortid.generate()
				const elementId = shortid.generate()
				const resourceId = shortid.generate()
				const layer = {
					id: layerId,
					elementId,
					w: (w !== undefined) ? w : width,
					h: (h !== undefined) ? h : height,
				}
				const element = {
					id: elementId,
					type: "image",
					resourceId,
				}
				const resource = {
					id: resourceId,
					type: "image/png", // UGLY...
					name: "test.png", // UGLY...
					src,
				}
				dispatch({
					type: types.LAYER_ADD_SUCCESS,
					pageId: currentPage.id,
					layer,
					element,
					resource,
				})
			}, (error) => {
				dispatch({ type: types.LAYER_ADD_ERROR, error })
			})
	}
)

export const removeLayer = (layerId) => (
	(dispatch, getState) => {
		const currentPage = getCurrentPage(getState())
		dispatch({ type: types.DELETE_LAYER, pageId: currentPage.id, layerId })
	}
)

export const moveBackward = (layerId) => (
	(dispatch, getState) => {
		reorderLayerIds(dispatch, getState(), layerId, "-", 1)
	}
)

export const moveForward = (layerId) => (
	(dispatch, getState) => {
		reorderLayerIds(dispatch, getState(), layerId, "+", 1)
	}
)

const reorderLayerIds = (dispatch, state, layerId, operator, value) => {
	const {
		currentPageId, layerIds, oldIndex,
	} = getInfoForLayerOrderChange(state, layerId)
	let newIndex
	switch (operator) {
	case "+":
		newIndex = oldIndex + value
		break
	case "-":
		newIndex = oldIndex - value
		break
	default:
		break
	}
	const newLayersId = reorderArray(layerIds, oldIndex, newIndex)
	dispatch({
		type: types.SET_LAYER_ORDER,
		pageId: currentPageId,
		layerIds: newLayersId,
	})
}

const getInfoForLayerOrderChange = (state, layerId) => {
	const { ui, project } = state.editor
	const { currentPageId } = ui
	const { projectData } = project
	const { story } = projectData
	const { pages } = story
	const page = pages[currentPageId]
	const { layerIds } = page
	const oldIndex = layerIds.indexOf(layerId)
	return { currentPageId, layerIds, oldIndex }
}

const reorderArray = (array, oldIndex, newIndex) => {
	const arrayFragment = array.splice(oldIndex, 1)
	array.splice(newIndex, 0, arrayFragment[0])
	return array
}

export const updateLayerVariables = (layerId, updatedVariables) => (
	(dispatch, getState) => {
		const { editor } = getState()
		const { ui } = editor
		const { currentPageId } = ui
		dispatch({
			type: types.UPDATE_LAYER_VARIABLES,
			pageId: currentPageId,
			layerId,
			updatedVariables,
		})
	}
)

export const exitProject = () => (
	(dispatch, getState) => {
		const { projectData } = getState().editor.project
		updateProjectJson(projectData) // Save project
		dispatch({ type: types.EXIT_PROJECT })
	}
)

// Balloon

export const addBalloonToPage = () => (
	(dispatch, getState) => {
		const currentPage = getCurrentPage(getState())
		const balloon = {
			text: null,
			drawingStyle: {
				borderRadius: 0,
				borderWidth: 1,
				borderColor: "#000000",
				backgroundColor: "#FFFFFF",
			},
			textStyle: {
				fontName: "Arial, sans-serif",
				fontSize: 10,
				color: "#000000",
			},
		}
		const layerId = shortid.generate()
		const elementId = shortid.generate()
		const layer = {
			id: layerId,
			elementId,
			w: 300, // UGLY...
			h: 300,
		}
		const element = {
			id: elementId,
			type: "balloon",
			balloon,
		}
		dispatch({
			type: types.ADD_BALLOON,
			pageId: currentPage.id,
			layer,
			element,
		})
		dispatch(setSelectedLayers([layerId]))
	}
)

export const updateballoonDataVariables = (elementId, updatedVariables) => ({
	type: types.UPDATE_BALLOON_DATA_VARIABLES, elementId, updatedVariables,
})
