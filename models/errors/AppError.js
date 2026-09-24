// Criado para ser um Error normal com um campo a mais o StatusCode, guradando no prorpio objeto do erro
// Ele só vai carregar essa informação extra junto

export class AppError extends Error {
    constructor(message, statusCode = 400){
        super(message)

        this.statusCode = statusCode
        this.name = 'AppError'
    }
}