import shortid from "shortid"

import * as types from "src/constants/actionTypes"
import {
	getProjectsArray,
	createProjectWithData,
	getProjectWithId,
	deleteProjectWithId,
} from "src/utils/fileProvider"
import { goToPageWithId } from "src/actions/editor"

export const listProjects = () => (
	(dispatch) => {
		dispatch({ type: types.START_PROJECTS_METADATA_LOAD })
		getProjectsArray()
			.then((projectsArray) => {
				let projects = {}
				if (projectsArray) {
					projectsArray.forEach((project) => {
						projects = {
							...projects,
							[project.id]: project,
						}
					})
				}
				dispatch({ type: types.PROJECTS_METADATA_LOAD_SUCCESS, projects })
			}, (error) => {
				dispatch({ type: types.PROJECTS_METADATA_LOAD_ERROR, error })
			})
	}
)

export const createProject = () => (
	(dispatch) => {
		dispatch({ type: types.START_PROJECT_CREATION })
		const id = shortid.generate()
		createProjectWithData(id)
			.then(() => {
				dispatch({ type: types.PROJECT_CREATION_SUCCESS })
				dispatch(listProjects())
				dispatch(runEditorForProjectWithId(id))
			}, (error) => {
				dispatch({ type: types.PROJECT_CREATION_ERROR, error })
			})
	}
)

export const openStory = (projectId) => (
	(dispatch) => {
		dispatch({ type: types.START_PROJECT_LOAD })
		getProjectWithId(projectId)
			.then((projectData) => {
				const { story } = projectData
				const { pageIds } = story
				const startPageId = pageIds[0]
				dispatch({ type: types.PROJECT_LOAD_SUCCESS, projectData })
				dispatch(goToPageWithId(startPageId))
			}, (error) => {
				dispatch({ type: types.PROJECT_LOAD_ERROR, error })
			})
	}
)

export const deleteProject = (projectId) => (
	(dispatch) => {
		dispatch({ type: types.START_PROJECT_DELETE })
		deleteProjectWithId(projectId)
			.then(() => {
				dispatch({ type: types.PROJECT_DELETE_SUCCESS })
				dispatch(listProjects())
			}, (error) => {
				dispatch({ type: types.PROJECT_DELETE_ERROR, error })
			})
	}
)

export const runEditorForProjectWithId = (id) => ({ type: types.RUN_PROJECT_EDITOR, id })