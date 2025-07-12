// Example global type
declare type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
}; 