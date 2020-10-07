import { combineReducers } from "redux"
import { createSelector } from "reselect"

import * as types from "src/constants/actionTypes"

const defaultAnimationDuration = 1000

const initialUiState = {
	currentPageId: null,
	selectedLayerIds: [],
	motionCaptureData: {
		state: "inactive",
		duration: defaultAnimationDuration,
		layerId: null,
		array: [],
	},
}

const ui = (state = initialUiState, action) => {
	let newState = state

	switch (action.type) {

	case types.GO_TO_PAGE: // action.pageId
		newState = {
			...initialUiState,
			currentPageId: action.pageId,
		}
		break

	case types.SET_SELECTED_LAYERS: // action.layerIds
		newState = {
			...state,
			selectedLayerIds: action.layerIds,
		}
		break

	case types.UPDATE_MOTION_CAPTURE_DATA: // action.data
		newState = {
			...state,
			motionCaptureData: {
				...state.motionCaptureData,
				...action.data,
			},
		}
		break

	case types.EXIT_PROJECT:
		newState = initialUiState
		break

	default:
		break
	}

	return newState
}

const initialProjectState = {
	projectData: {},
	error: null,
}

const project = (state = initialProjectState, action) => {
	let newState = state
	let editedPageIds = []
	let editedPages = {}
	let editedLayers = {}
	if (state.projectData.story) {
		if (state.projectData.story.pageIds) {
			editedPageIds = state.projectData.story.pageIds.slice()
		}
		editedPages = { ...state.projectData.story.pages }
		editedLayers = { ...state.projectData.story.layers }
	}
	switch (action.type) {

	case types.START_PROJECT_LOAD:
		break

	case types.PROJECT_LOAD_SUCCESS: // action.projectData
		newState = {
			...state,
			projectData: action.projectData || {},
		}
		break

	case types.PROJECT_LOAD_ERROR: // action.error
		newState = {
			...state,
			error: action.error,
		}
		break

	case types.ADD_PAGE: // action.page
		newState = {
			...state,
			projectData: {
				...state.projectData,
				story: {
					...state.projectData.story,
					pageIds: [
						...state.projectData.story.pageIds,
						action.page.id,
					],
					pages: {
						...state.projectData.story.pages,
						[action.page.id]: action.page,
					},
				},
			},
		}
		break

	case types.DELETE_PAGE: // action.pageId
		editedPageIds.splice(
			editedPageIds.findIndex((pageId) => pageId === action.pageId),
			1,
		)
		delete editedPages[action.pageId]
		newState = {
			...state,
			projectData: {
				...state.projectData,
				story: {
					...state.projectData.story,
					pageIds: editedPageIds,
					pages: editedPages,
				},
			},
		}
		break

	case types.REORDER_PAGES: // action.oldIndex, action.newIndex
		const arrayFragment = editedPageIds.splice(action.oldIndex, 1)
		editedPageIds.splice(action.newIndex, 0, arrayFragment[0])
		newState = {
			...state,
			projectData: {
				...state.projectData,
				story: {
					...state.projectData.story,
					pageIds: editedPageIds,
				},
			},
		}
		break

	case types.START_LAYER_ADD:
		break

	case types.LAYER_ADD_SUCCESS: // action.pageId, action.layer, action.element, action.resource
		newState = {
			...state,
			projectData: {
				...state.projectData,
				story: {
					...state.projectData.story,
					pages: {
						...state.projectData.story.pages,
						[action.pageId]: {
							...state.projectData.story.pages[action.pageId],
							layerIds: [
								...state.projectData.story.pages[action.pageId].layerIds, action.layer.id,
							],
							layers: {
								...state.projectData.story.pages[action.pageId].layers,
								[action.layer.id]: action.layer,
							},
						},
					},
					elements: {
						...state.projectData.story.elements,
						[action.element.id]: action.element,
					},
					resources: {
						...state.projectData.story.resources,
						[action.resource.id]: action.resource,
					},
				},
			},
		}
		break

	case types.LAYER_ADD_ERROR: // action.error
		break

	case types.DELETE_LAYER: // action.pageId, action.layerId
		delete editedLayers[action.layerId]
		const page = editedPages[action.pageId]
		const pageLayerIds = page.layerIds
		pageLayerIds.splice(
			pageLayerIds.findIndex((layerId) => layerId === action.layerId),
			1,
		)
		const pageLayers = { ...page.layers }
		delete pageLayers[action.layerId]
		newState = {
			...state,
			projectData: {
				...state.projectData,
				story: {
					...state.projectData.story,
					pages: {
						...state.projectData.story.pages,
						[action.pageId]: {
							...state.projectData.story.pages[action.pageId],
							layerIds: pageLayerIds,
							layers: pageLayers,
						},
					},
					//layers: editedLayers,
				},
			},
		}
		break

	case types.SET_LAYER_ORDER: // action.pageId, action.layerIds
		newState = {
			...state,
			projectData: {
				...state.projectData,
				story: {
					...state.projectData.story,
					pages: {
						...state.projectData.story.pages,
						[action.pageId]: {
							...state.projectData.story.pages[action.pageId],
							layerIds: action.layerIds,
						},
					},
				},
			},
		}
		break

	case types.UPDATE_LAYER_VARIABLES: // action.pageId, action.layerId, action.updatedVariables
		newState = {
			...state,
			projectData: {
				...state.projectData,
				story: {
					...state.projectData.story,
					pages: {
						...state.projectData.story.pages,
						[action.pageId]: {
							...state.projectData.story.pages[action.pageId],
							layers: {
								...state.projectData.story.pages[action.pageId].layers,
								[action.layerId]: {
									...state.projectData.story.pages[action.pageId].layers[action.layerId],
									...action.updatedVariables,
								},
							},
						},
					},
				},
			},
		}
		break

	case types.ADD_BALLOON: // action.pageId, action.layer, action.element
		newState = {
			...state,
			projectData: {
				...state.projectData,
				story: {
					...state.projectData.story,
					pages: {
						...state.projectData.story.pages,
						[action.pageId]: {
							...state.projectData.story.pages[action.pageId],
							layerIds: [
								...state.projectData.story.pages[action.pageId].layerIds, action.layer.id,
							],
							layers: {
								...state.projectData.story.pages[action.pageId].layers,
								[action.layer.id]: action.layer,
							},
						},
					},
					elements: {
						...state.projectData.story.elements,
						[action.element.id]: action.element,
					},
				},
			},
		}
		break

	case types.UPDATE_BALLOON_DATA_VARIABLES: // action.elementId, action.textRect, action.updatedVariables
		newState = {
			...state,
			projectData: {
				...state.projectData,
				story: {
					...state.projectData.story,
					elements: {
						...state.projectData.story.elements,
						[action.elementId]: {
							...state.projectData.story.elements[action.elementId],
							balloon: action.updatedVariables,
						},
					},
				},
			},
		}
		break

	case types.EXIT_PROJECT:
		newState = initialProjectState
		break

	default:
		break
	}

	return newState
}

const editor = combineReducers({ ui, project })

export default editor


// Selectors


const getCurrentPageId = (state) => state.editor.ui.currentPageId
const getStory = (state) => state.editor.project.projectData.story

const getPages = createSelector(
	[getStory],
	(story) => {
		if (story) {
			return story.pages || {}
		}
		return {}
	},
)

export const getCurrentPage = createSelector(
	[getCurrentPageId, getPages],
	(currentPageId, pages) => {
		if (currentPageId && pages && pages[currentPageId]) {
			return pages[currentPageId] || {}
		}
		return {}
	},
)

const getElements = createSelector(
	[getStory],
	(story) => {
		if (story) {
			return story.elements || {}
		}
		return {}
	},
)

const getResources = createSelector(
	[getStory],
	(story) => {
		if (story) {
			return story.resources || {}
		}
		return {}
	},
)

export const getLayerDataArray = createSelector(
	[getCurrentPage, getElements, getResources],
	(currentPage, elements, resources) => {
		const { layerIds, layers } = currentPage
		if (layerIds && layerIds.length > 0) {
			return layerIds.map((layerId) => {
				const layer = layers[layerId] || {}
				const data = { id: layerId, ...layer }
				if (layer.elementId && elements[layer.elementId]) {
					const element = elements[layer.elementId]
					if (element.resourceId && resources[element.resourceId]) {
						const resource = resources[element.resourceId]
						data.src = resource.src
					} else if (element.balloon) {
						data.balloon = element.balloon
					}
				}
				return data
			})
		}
		return []
	},
)
