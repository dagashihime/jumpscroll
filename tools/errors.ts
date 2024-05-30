import JumpState from "../states/jump-state"
import { Options } from "../types"

const MSG_BASE = 'Jump Error:'

const handleNoJumps = ({ options }: { options?: Options })=> {
    if(options && options.debug) { console.error(`${MSG_BASE} no jumps where found!`) }
}

const handleNoCurrentJump = ({ state, options }: { state: JumpState, options?: Options })=> {
    if(options && options.debug) { console.error(`${MSG_BASE} could not find the current jump, using fallback instead!`) }

    return state.current
}

export {
    handleNoJumps,
    handleNoCurrentJump
}