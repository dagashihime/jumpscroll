import { handleNoCurrentJump } from "./tools/errors"
import { JumpState } from "./tools/states"
import defaults from "./json/defaults.json";
import { Jumps, Options } from "./types";

interface setupJumpsInput {
    jumps: Jumps
    options?: Options
}

const getCurrentJump = ({ jumps }: { jumps: Jumps })=> {
    const list = Array.from(jumps).filter(jump => {
        const { bottom } = jump.getBoundingClientRect()
        const calc = bottom - (window.innerHeight / 2)

        return (
            calc > 0 && 
            calc < window.innerHeight
        )
    })

    return list.length === 1
        ? list[0]
        : null
}

const getCurrentIndex = ({ jumps, currentJump }: { jumps: Jumps, currentJump: HTMLElement })=> {
    const index = Array.from(jumps).indexOf(currentJump)

    return index
}

const getNextIndex = ({ jumps, direction, currentIndex  }: { jumps: Jumps, direction: boolean, currentIndex: number })=> {
    const min = 0
    const max = jumps.length > 0 ? jumps.length - 1 : jumps.length

    const nextIndex = currentIndex + (direction ? -1 : 1)

    if(nextIndex < min || nextIndex > max) return false;

    return nextIndex
}

const listen = ({ jumps, options }: setupJumpsInput)=> {
    options = { ...defaults, ...options }

    if(options.adjustScrollBehavior) {
        document.documentElement.style.scrollBehavior = 'smooth'
    }

    const state = new JumpState({ current: jumps[0] })

    window.addEventListener('wheel', e=> {
        e.preventDefault()

        const direction = e.deltaY < 0

        const currentJump = getCurrentJump({ jumps })
            ?? handleNoCurrentJump({ state, options })
        state.current = currentJump

        const currentIndex = getCurrentIndex({ jumps, currentJump })

        const nextIndex = getNextIndex({ jumps, direction, currentIndex })

        if(nextIndex !== false) { jumps[nextIndex].scrollIntoView() }
    }, { passive: false })
}

export {
    listen
}

export type {
    Jumps
}