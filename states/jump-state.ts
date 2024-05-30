import { Jumps, Options } from "../types"
import { handleNoCurrentJump, handleNoJumps } from "../tools/errors"
import OptionsState from "./options-state"

class JumpState {
    public current: HTMLElement | undefined
    public direction: boolean = false
    private initialized: boolean = false
    private jumps: Jumps | undefined
    private options: Options

    constructor({ options }: { options: OptionsState }) {
        this.options = options
    }

    get isInitialized(): boolean
    {
        return this.initialized
    }

    get inPosition(): boolean 
    {
        if(this.current === undefined) { 
            handleNoCurrentJump({ state: this, options: this.options })
            return false;
        }

        const { top, bottom } = this.current.getBoundingClientRect()

        return (
            top >= 0 || 
            bottom - window.innerHeight <= 0
        )
    }

    get currentIndex(): number
    {
        if(this.current === undefined) { 
            handleNoCurrentJump({ state: this, options: this.options })
            return -1;
        }
        if(this.jumps === undefined) {
            handleNoJumps({ options: this.options })
            return -1
        }

        return Array.from(this.jumps).indexOf(this.current)
    }

    // add validation
    get target(): HTMLElement | undefined
    {
        if(this.jumps === undefined) {
            handleNoJumps({ options: this.options })
            return undefined
        }

        return this.jumps[this.targetIndex]
    }

    get targetIndex(): number
    {
        if(this.jumps === undefined) {
            handleNoJumps({ options: this.options })
            return -1
        }

        const min = 0
        const max = this.jumps.length > 0 ? this.jumps.length - 1 : this.jumps.length
    
        const nextIndex = this.currentIndex + (this.direction ? -1 : 1)
    
        if(nextIndex < min || nextIndex > max) return -1;
    
        return nextIndex
    }

    get validJump(): boolean
    {
        return this.targetIndex > -1
    }

    init(jumps?: Jumps) {
        if(this.initialized) return this.initialized;

        this.jumps = jumps 
            ? jumps
            : document.querySelectorAll('[data-jump]')

        this.updateCurrent()

        this.initialized = true
    }

    updateCurrent() {
        if(this.jumps === undefined) {
            handleNoJumps({ options: this.options })
            return;
        }

        const list = Array.from(this.jumps).filter(jump => {
            const { bottom } = jump.getBoundingClientRect()
            const calc = bottom - (window.innerHeight / 2)

            return (
                calc > 0 && 
                calc < window.innerHeight
            )
        })

        this.current = list.length === 1
            ? list[0]
            : handleNoCurrentJump({ state: this, options: this.options })
    }
}

export default JumpState