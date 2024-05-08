type Jumps = NodeListOf<HTMLElement>

interface setupJumpsInput {
    jumps: Jumps
    options?: JumpScrollOptions
}

interface JumpScrollOptions {
    adjustScrollBehavior: boolean
}

const defaultOptions: JumpScrollOptions = {
    adjustScrollBehavior: true
}

const jump = ({ jumps, direction }: { jumps: Jumps, direction: boolean })=> {
    const availableJumps = Array.from(jumps).filter(jump => {
        const { bottom, top } = jump.getBoundingClientRect()

        return direction
            ? top < 0
            : bottom - window.innerHeight > 0
    });

    const firstJump = (
        direction 
            ? availableJumps.reverse()
            : availableJumps
    )[0]

    if(firstJump) { firstJump.scrollIntoView() }
}

const listen = ({ jumps, options }: setupJumpsInput)=> {
    options = { ...defaultOptions, ...options }

    if(options.adjustScrollBehavior) {
        document.documentElement.style.scrollBehavior = 'smooth'
    }

    window.addEventListener('wheel', ({ deltaY })=> {
        const direction = deltaY < 0

        jump({ jumps, direction })
    })
}

export {
    listen
}

export type {
    Jumps
}