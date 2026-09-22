export class IntegrantesPr {
    constructor(id, projeto_id, nome, serie, curso){
        this.id = id,
        this.projeto_id = projeto_id,
        this.nome = nome,
        this.serie = serie,
        this.curso = curso
    }

    get idIntegrante(){
        return this.id
    }

    get idProjetoIntegrante(){
        return this.projeto_id
    }

    get nomeIntegrante(){
        return this.nome
    }
}