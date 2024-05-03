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

let scrollable = true
let oldScroll = window.scrollY

const jump = ({ jumps }: { jumps: Jumps })=> {
    const availableJumps = Array.from(jumps).filter(jump => {
        const { bottom, top } = jump.getBoundingClientRect()

        return oldScroll < window.scrollY
            ? bottom - window.innerHeight > 0
            : top < 0
    });

    const firstJump = (oldScroll < window.scrollY ? availableJumps : availableJumps.reverse())[0]

    if(firstJump) {
        firstJump.scrollIntoView()
    }
}

const setupJumps = ({ jumps, options }: setupJumpsInput)=> {
    options = { ...defaultOptions, ...options }

    if(options.adjustScrollBehavior) {
        document.documentElement.style.scrollBehavior = 'smooth'
    }

    window.addEventListener('scroll', e=> {
        if(!scrollable) return;
        scrollable = false

        jump({ jumps })

        oldScroll = window.scrollY
    })

    window.addEventListener('scrollend',()=> {
        scrollable = true
    })
}

export {
    setupJumps
}

export type {
    Jumps
}