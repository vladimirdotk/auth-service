export interface IError extends Error {
    details?: {}[];
    status?: number;
    syscall?: string;
    code?: string;
}
