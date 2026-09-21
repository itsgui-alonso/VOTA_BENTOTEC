export class Projeto {
    constructor(id, name, description, categoryId){
        this._id = id,
        this._name = name,
        this._description = description,
        this._categoryId = categoryId
    }

    get idProjeto(){
        return this._id
    }

    get nameProjeto(){
        return this._name
    }

    get descriptionProjeto(){
        return this._description
    }

    get categoryIdProjeto(){
        return this._categoryId
    }
}
