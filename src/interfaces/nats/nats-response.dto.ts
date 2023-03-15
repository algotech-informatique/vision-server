export class NatsResponse {
    hasError: boolean;
    deliveryDate:number;
    httpCode:number;
    errorMsg?: string;
    response?:any;
}