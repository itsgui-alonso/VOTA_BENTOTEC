export class Categoria {
    constructor(id, name){
        this._id = id,
        this._name = name
    }

    get idCategoria(){
        return this._id
    }

    get nameCategoria(){
        return this._name
    }
}