import { AppError } from "../models/errors/AppError.js";
import { fail } from "../utils/Resposta.js";
export function RotaNaoEncontrada(req, res){
    return fail(res, 404, 'Rota não encontrada') // Troca o cannot get em HTML por JSON
}

export function errorHandler(erro, req, res, next){
    if(erro instanceof AppError){
        return fail(res, erro.statusCode, erro.message)
    }

    // Se passar de 10kb ele ja fala antes de chegar em qualquer rota. Antes devolvia 500 em vez de 413
    if(erro.type === 'entity.too.large'){
        return fail(res, 413, 'O corpo da requisição é muito grande! O limite é de 10kb')
    }

    if(erro.type === 'entity.parse.failed'){
        return fail(res, 400, 'JSON invalido no corpo da requisição')
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