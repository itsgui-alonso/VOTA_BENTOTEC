export class Categoria {
    constructor(id, nome_categoria){
        this._id = id,
        this.nome_categoria = nome_categoria
    }

    get idCategoria(){
        return this._id
    }

    get nomeCategoria(){
        return this.nome_categoria
    }
}