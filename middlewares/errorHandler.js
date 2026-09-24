import { AppError } from "../models/errors/AppError.js";

export function errorHandler(erro, req, res, next){
    if(erro instanceof AppError){
        return res.status(erro.statusCode).json({erro: erro.message})
    }

    console.error(erro)
    return res.status(500).json({erro: 'Erro interno do servidor!'})
}

/*
Criado para mostar quando a  mensagem é segura de mostrar e o StatusCOde já vem pronto
Se for por exemplo um bug no figma, o prisma dando erro, qualquer outro bug...
A mensgame fica só no console.error e o user vai receber um erro generico (500)
Sem detalhes do que aconteceu, mas eu vou saber o que aconteceu
*/ 