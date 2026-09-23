export function validate(schema){
    return (req, res, next) => {

        // Usei o safeParse pois ele executa a validação sem usar uma exeção (tipo Throw error)
        const resultado = schema.safeParse(req.body)

        //Se a validação falhar
        if(!resultado.success){
            const detalhes = resultado.error.issues.map(issue => ({
                campo: issue.path.join('.') || '(corpo da requisição)',
                mensagem: issue.message
            }))

            // Retorna resposta para o erro de validacao (400)

            return res.status(400).json({erro: "Dados inválidos", detalhes})
        }
        // Se a validação passar , substitui o req.body pelo dados limpos e validados
        req.body = resultado.data
        next()
    }

}