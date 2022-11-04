export class ResponseTokenDestroyDto {
    status: number;
    message: string;
    errors: { [key: string]: any } | null;
}
