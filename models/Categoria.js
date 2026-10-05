export class Categoria {
    constructor({id, nome_categoria}){
        this._id = id,
        this.nome_categoria = nome_categoria
    }

    get idCategoria(){
        return this._id
    }

    get nomeCategoria(){
        return this.nome_categoria
    }
    
    // O JSON.stringify (e o res.json) chama este método sozinho.
    // Sem ele, o campo sairia como "_id" na resposta.
    toJSON(){
        const { _id, ...resto } = this
        return { id: _id, ...resto}
    }
}