
type DataUpdateHandler = (spec: Spec) => void

export default class SchemaService {
    private handlers: DataUpdateHandler[] = []

    onUpdateData = (spec: Spec) => {
        for (let d of this.handlers) {
            d(spec)
        }
    }

    // Registers a handler to receive updates when the data is being changed.
    registerDataUpdateHandler = (handler: DataUpdateHandler) => {
        this.handlers.push(handler)
    }

    // Unregisters a handler from receiving updates about the data being changed.
    unregisterDataUpdateHandler = (handler: DataUpdateHandler) => {
        const i = this.handlers.indexOf(handler)
        if (i >= 0) {
            this.handlers.splice(i, 1)
        }
    }
}

export interface Spec {
    initialSteps?: string[]
    steps?: Step[]
    results?: Map<string,Result>
}

export interface Step {
    id: string
    type: string
    params: Map<string,string>
    nextSteps: string[]
}

export interface Result {
    type: string,
    success: boolean
    data: any
}