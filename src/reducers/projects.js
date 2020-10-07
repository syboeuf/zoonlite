import * as types from "src/constants/actionTypes"

const initialState = {
	list: {},
	currentProjectId: null,
	currentActivity: null,
	error: null,
}

const projects = (state = initialState, action) => {
	let newState = state

	switch (action.type) {

	case types.START_PROJECTS_METADATA_LOAD:
		break

	case types.PROJECTS_METADATA_LOAD_SUCCESS: // action.projects
		newState = {
			...state,
			list: action.projects,
		}
		break

	case types.PROJECTS_METADATA_LOAD_ERROR: // action.error
		newState = {
			...state,
			error: action.error,
		}
		break

	case types.START_PROJECT_CREATION:
		break

	case types.PROJECT_CREATION_SUCCESS:
		break

	case types.PROJECT_CREATION_ERROR: // action.error
		newState = {
			...state,
			error: action.error,
		}
		break

	case types.START_PROJECT_DELETE:
		break

	case types.PROJECT_DELETE_SUCCESS:
		break

	case types.PROJECT_DELETE_ERROR:
		newState = {
			...state,
			error: action.error,
		}
		break

	case types.RUN_PROJECT_EDITOR: // action.id
		newState = {
			...state,
			currentProjectId: action.id,
			currentActivity: "edit",
		}
		break

	case types.EXIT_PROJECT:
		newState = {
			...state,
			currentProjectId: null,
			currentActivity: null,
		}
		break

	default:
		break
	}

	return newState
}

export default projects
