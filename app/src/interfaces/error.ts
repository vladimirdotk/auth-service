export interface IError extends Error {
    details?: {}[];
    status?: number;
}
