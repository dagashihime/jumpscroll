import { Jumps, Options } from "../types"
import { handleNoCurrentJump } from "./errors"

class JumpState {
    public current: HTMLElement | undefined
    public direction: boolean = false
    private jumps: Jumps
    private options: Options

    constructor({ jumps, options }: { jumps: Jumps, options: Options }) {
        this.jumps = jumps
        this.options = options
    
        this.updateCurrent()
    }

    get inPosition(): boolean 
    {
        if(this.current === undefined) { 
            handleNoCurrentJump({ state: this, options: this.options })
            return false;
        }

        const { top, bottom } = this.current.getBoundingClientRect()

        return (
            ( top >= 0 && this.direction ) || 
            ( bottom - window.innerHeight <= 0 && !this.direction )
        )
    }

    get currentIndex(): number
    {
        if(this.current === undefined) { 
            handleNoCurrentJump({ state: this, options: this.options })
            return -1;
        }

        return Array.from(this.jumps).indexOf(this.current)
    }

    // add validation
    get target(): HTMLElement
    {
        return this.jumps[this.targetIndex]
    }

    get targetIndex(): number
    {
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

    updateCurrent()
    {
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

export {
    JumpState
}