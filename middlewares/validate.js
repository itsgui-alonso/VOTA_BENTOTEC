export function validate(schema, target = 'body'){
    return (req, res, next) => {

        // Usei o safeParse pois ele executa a validação sem usar uma exeção (tipo Throw error)
        const resultado = schema.safeParse(req[target])

        //Se a validação falhar
        if(!resultado.success){
            const detalhes = resultado.error.issues.map(issue => ({
                campo: issue.path.join('.') || `(${target})`,
                mensagem: issue.message
            }))

            // Retorna resposta para o erro de validacao (400)

            return res.status(400).json({erro: "Dados inválidos", detalhes})
        }
        // Se a validação passar , substitui o req.body pelo dados limpos e validados ou para o req.query
        if(target === 'body'){
            req.body = resultado.data
        } else {
            // Salva como req.queryValidado ou req.paramsValidado
            req[`${target}Validado`] = resultado.data;
        }

        next()
    }

}