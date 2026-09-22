export class Votos{
    constructor({id, userId, projectId, categoryId, create_at}){
        this.id = id,
        this.userId = userId,
        this.projectId = projectId,
        this.categoryId = categoryId,
        this.create_at = create_at
    }

    get idVoto(){
        return this.id
    }

    get userIdVoto(){
        return this.userId
    }

    get projectIdVoto(){
        return this.projectId
    }

    get categoryIdVoto(){
        return this.categoryId
    }

    get createAtVoto(){
        return this.create_at
    }
}