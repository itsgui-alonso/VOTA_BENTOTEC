export class IntegrantesPr {
    constructor(id, projeto_id_integrante, nome_integrante, serie_integrante, curso_integrante){
        this.id = id,
        this.projeto_id_integrante = projeto_id_integrante,
        this.nome_integrante = nome_integrante,
        this.serie_integrante = serie_integrante,
        this.curso_integrante = curso_integrante
    }

    get idIntegrante(){
        return this.id
    }

    get idProjetoIntegrante(){
        return this.projeto_id_integrante
    }

    get nomeIntegrante(){
        return this.nome_integrante
    }
}