import { Image } from "react-native"
import AsyncStorage from "@react-native-community/async-storage"

import { createRawStory } from "./zoon"

export const clearDatabase = () => (AsyncStorage.clear())

export const createProjectWithData = (id) => (
	new Promise((resolve, reject) => {
		const story = createRawStory()
		const projectData = {
			id,
			metadata: {
				title: `Undefined-${id}`,
				coverSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbwAAAD6CAYAAADaxvIaAAAEIElEQVR4nO3OQREAIAAEIfuX1ha3DxkKcM4FgA/kAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQBYyAMAsJAHAGAhDwDAQh4AgIU8AAALeQAAFvIAACzkAQAYeJoU/2JZm+g7AAAAAElFTkSuQmCC",
			},
			story,
		}
		AsyncStorage.setItem(id, JSON.stringify(projectData))
			.then(() => {
				resolve()
			}, (error) => {
				reject(error)
			})
	})
)

export const getProjectsArray = () => (
	new Promise((resolve, reject) => {
		AsyncStorage.getAllKeys()
			.then((projectList) => {
				AsyncStorage.multiGet(projectList)
					.then((projectIdAndDataArray) => {
						const projectsArray = []
						projectIdAndDataArray.forEach((projectIdAndData) => {
							if (projectIdAndData[1]) {
								const project = JSON.parse(projectIdAndData[1])
								projectsArray.push(project)
							} else {
								AsyncStorage.removeItem(projectIdAndData[0]) // Even with that, keys keep reappearing...
							}
						})
						resolve(projectsArray)
					}, (error) => {
						reject(error)
					})
			}, (error) => {
				reject(error)
			})
	})
)

export const updateProjectJson = (projectData) => (
	new Promise((resolve, reject) => {
		AsyncStorage.setItem(projectData.id, JSON.stringify(projectData))
			.then(() => {
				console.log("Project saved")
				resolve()
			}, (error) => {
				reject(error)
			})
	})
)

export const deleteProjectWithId = (projectId) => (
	new Promise((resolve, reject) => {
		AsyncStorage.removeItem(projectId)
			.then(() => {
				console.log("Project deleted")
				resolve()
			}, (error) => {
				reject(error)
			})
	})
)

export const getProjectWithId = (projectId) => (
	new Promise((resolve, reject) => {
		AsyncStorage.getItem(projectId)
			.then((projectData) => {
				const project = JSON.parse(projectData)
				resolve(project)
			}, (error) => {
				reject(error)
			})
	})
)

export const addImageToProject = (src) => (
	new Promise((resolve, reject) => {
		Image.getSize(src, (width, height) => {
			resolve({ width, height })
		}, (error) => {
			reject(error)
		})
	})
)
