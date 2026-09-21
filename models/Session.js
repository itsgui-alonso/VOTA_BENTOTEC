export class Session{
    constructor(id, userId, token, _create_at, expires_at){
        this._id = id,
        this._userId = userId,
        this._token = token,
        this._create_at = _create_at,
        this._expires_at = expires_at
    }

    get idSession(){
        return this._id
    }

    get userIdSession(){
        return this._userId
    }

    get tokenSession(){
        return this._token
    }

    get create_atSession(){
        return this._create_at
    }

    get expires_atSession(){
        return this._expires_at
    }


}