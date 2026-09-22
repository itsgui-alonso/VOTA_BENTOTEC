export class Projeto {
    constructor({
        id, 
        nome_completo_projeto,
        nome_projeto, descricao,
        palavras_chave,
        categoria_id,
        create_at,
        numero_projeto,
        stand_projeto,
        escola,
        orientador,
        co_orientador
    }){
        this._id = id,
        this.nome_completo_projeto = nome_completo_projeto,
        this.nome_projeto = nome_projeto,
        this.descricao = descricao,
        this.palavras_chave = palavras_chave,
        this.categoria_id = categoria_id,
        this.create_at = create_at,
        this.numero_projeto = numero_projeto,
        this.stand_projeto = stand_projeto,
        this.escola = escola,
        this.orientador = orientador,
        this.co_orientador = co_orientador
    }

    get idProjeto(){
        return this._id
    }

    get nomeProjeto(){
        return this.nome_projeto
    }

    get nomeCompletoProjeto(){
        return this.nome_completo_projeto
    }

    get descricaoProjeto(){
        return this.descricao
    }

    get categoriaIdProjeto(){
        return this.categoria_id
    }

    get createAt(){
        return this.create_at
    }

    get numeroStand(){
        return this.stand_projeto
    }

    get numeroProjeto(){
        return this.numero_projeto
    }
}
