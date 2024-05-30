import { Options } from "../types"

class OptionsState {
    private props: Options

    constructor(options: Options) {
        // @ToDo: better way to init than double init
        this.props = options
        this.set(options)
    }

    get debug(): Options['debug']
    {
        return this.props.debug
    }

    set adjustScrollBehavior(value: Options['adjustScrollBehavior']) {
        this.props.adjustScrollBehavior = value

        if(value === true) { document.documentElement.style.scrollBehavior = 'smooth' }
    }

    set debug(value: Options['debug']) {
        this.props.debug = value
    }

    set(object: Options) {
        // @ToDo: add check if properties exist
        // @ts-ignore
        Object.keys(object).map(key => this[key] = object[key])
    }
}

export default OptionsState