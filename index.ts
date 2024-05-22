import { JumpState } from "./tools/states"
import defaults from "./json/defaults.json";
import { Jumps, Options } from "./types";

interface setupJumpsInput {
    jumps: Jumps
    options?: Options
}

const listen = ({ jumps, options }: setupJumpsInput)=> {
    options = { ...defaults, ...options }

    if(options.adjustScrollBehavior) {
        document.documentElement.style.scrollBehavior = 'smooth'
    }

    const state = new JumpState({ jumps, options })

    window.addEventListener('wheel', e=> {
        state.direction = e.deltaY < 0
        state.updateCurrent()

        if(state.inPosition) {
            e.preventDefault()
    
            if(state.validJump) { state.target.scrollIntoView() }
        }
    }, { passive: false })

    let scrollStop: number | null = null
    window.addEventListener('scroll', ()=> {
        if(scrollStop !== null) { clearTimeout(scrollStop) }

        scrollStop = setTimeout(()=> {
            if(state.inPosition) { state.target.scrollIntoView() }
        }, 150)
    })
}

export {
    listen
}

export type {
    Jumps
}