export class Usuario{
    constructor(id, qrCode, createAt, nome, cpf, email, telefone, tipoVisitante, origem, status){
        this._id = id
        this._qrCode = qrCode
        this.createAt = createAt
        this.nome = nome
        this.cpf = cpf
        this.email = email
        this.telefone = telefone
        this.tipoVisitante = tipoVisitante
        this.origem = origem
        this.status = status
    }

    get idUsuario(){
        return this._id
    }

    get qrCodeUsuario(){
        return this._qrCode
    }

    get createAtUsuario(){
        return this.createAt
    }
}