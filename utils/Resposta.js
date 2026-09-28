export function success(res, dados = null, statusCode = 200, meta){ //Dados como null, se n tiver dados fica null
    const corpo = { sucesso: true, dados}

    if(meta){
        corpo.meta = meta // Só vai ser inserido no corpo se tiver meta
    }

    return res.status(statusCode).json(corpo)
}

export function fail(res, statusCode, erro, detalhes){
    const corpo = { sucesso: false, erro}

    if(detalhes){
        corpo.detalhes = detalhes // Mesma coisa, só vai ser inserido no corpo se tiver detalhes
    }

    return res.status(statusCode).json(corpo)
}