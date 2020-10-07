import { combineReducers } from "redux"

import projects from "./projects"
import editor from "./editor"

export default combineReducers({ projects, editor })