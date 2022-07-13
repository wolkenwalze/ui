export default interface Result {
    success: boolean
    error: string
    latencies?: Map<string,number>
    podNamespace?: string
    podName?: string
}