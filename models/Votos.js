export class Votos{
    constructor(id, userId, projectId, categoryId, createAt){
        this._id = id,
        this._userId = userId,
        this._projectId = projectId,
        this._categoryId = categoryId
        this._create_at = createAt
    }

    get idVoto(){
        return this._id
    }

    get userIdVoto(){
        return this._userId
    }

    get projectIdVoto(){
        return this._projectId
    }

    get categoryIdVoto(){
        return this._categoryId
    }

    get createAtVoto(){
        return this._create_at
    }
}