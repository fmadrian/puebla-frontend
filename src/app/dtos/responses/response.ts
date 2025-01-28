export interface APIResponse<T> {
    result: boolean,
    object: T,
    errors: string[]
    message?: string
}