import JumpState from "./states/jump-state"
import defaults from "./json/defaults.json";
import { Jumps, Options } from "./types";
import OptionsState from "./states/options-state";

interface ConfigureInput {
    jumps?: Jumps
    options?: Options
}

let JumpScroll: {
    configure: (input: ConfigureInput)=> typeof JumpScroll
    listen: (input?: ConfigureInput)=> typeof JumpScroll
    jump: JumpState
};

const appOptions = new OptionsState(defaults)
const jump = new JumpState({ options: appOptions });

const configure: typeof JumpScroll['configure'] = ({ jumps, options })=> {
    if(jumps) {
        jump.init(jumps)
    }

    if(options) {
        appOptions.set(options)
    }

    return JumpScroll
}

const listen: typeof JumpScroll['listen'] = input=> {
    if(input) { configure(input) }

    if(!jump.isInitialized) jump.init()

    let lastScrollY = window.scrollY
    window.addEventListener('scroll', ()=> {
        jump.direction = lastScrollY > window.scrollY

        lastScrollY = window.scrollY
    })

    window.addEventListener('wheel', e=> {
        jump.direction = e.deltaY < 0

        jump.updateCurrent()

        if(jump.inPosition) {
            e.preventDefault()
    
            if(jump.validJump && jump.target) { jump.target.scrollIntoView() }
        }
    }, { passive: false })

    let scrollStop: number | null = null
    window.addEventListener('scroll', ()=> {
        if(scrollStop !== null) { clearTimeout(scrollStop) }

        scrollStop = setTimeout(()=> {
            jump.updateCurrent()
            if(jump.inPosition && jump.current) { jump.current.scrollIntoView() }
        }, 100)
    })

    return JumpScroll
}

JumpScroll = {
    configure,
    jump,
    listen
}

export default JumpScroll