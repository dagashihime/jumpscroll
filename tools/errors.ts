import { Options } from "../types"
import { JumpState } from "./states"

const handleNoCurrentJump = ({ state, options }: { state: JumpState, options: Options })=> {
    if(options.debug) { console.error('Jump Error: could not find the current jump, using fallback instead!') }

    return state.current
}

export {
    handleNoCurrentJump
}