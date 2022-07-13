
type DataUpdateHandler = (spec: Spec) => void
type SpecUpdateHandler = (spec: Spec) => void

export default class SchemaService {
    private dataUpdateHandlers: DataUpdateHandler[] = []
    private specUpdateHandlers: SpecUpdateHandler[] = []

    onUpdateData = (spec: Spec) => {
        for (let d of this.dataUpdateHandlers) {
            d(spec)
        }
    }

    onUpdateSpec = (spec: Spec) => {
        for (let s of this.specUpdateHandlers) {
            s(spec)
        }
    }

    // Registers a handler to receive updates when the data is being changed.
    registerDataUpdateHandler = (handler: DataUpdateHandler) => {
        this.dataUpdateHandlers.push(handler)
    }

    // Unregisters a handler from receiving updates about the data being changed.
    unregisterDataUpdateHandler = (handler: DataUpdateHandler) => {
        const i = this.dataUpdateHandlers.indexOf(handler)
        if (i >= 0) {
            this.dataUpdateHandlers.splice(i, 1)
        }
    }

    registerSpecUpdateHandler = (handler: SpecUpdateHandler) => {
        this.specUpdateHandlers.push(handler)
    }

    unregisterSpecUpdateHandler = (handler: SpecUpdateHandler) => {
        const i = this.specUpdateHandlers.indexOf(handler)
        if (i >= 0) {
            this.specUpdateHandlers.splice(i, 1)
        }
    }
}

export interface Spec {
    initialSteps?: string[]
    steps?: Step[]
    result?: {[key: string]:Result}
}

export interface Step {
    id: string
    type: string
    params: {[key: string]:string}
    nextSteps: string[]
}

export interface Result {
    success: boolean
    error: string
    latencies?: {[key: string]:number}
    podNamespace?: string
    podName?: string
}