export class Session{
    constructor(id, userId, token, create_at, expires_at){
        this.id = id,
        this.userId = userId,
        this.token = token,
        this.create_at = create_at,
        this.expires_at = expires_at
    }

    get idSession(){
        return this.id
    }

    get userIdSession(){
        return this.userId
    }

    get tokenSession(){
        return this.token
    }

    get create_atSession(){
        return this.create_at
    }

    get expires_atSession(){
        return this.expires_at
    }


}