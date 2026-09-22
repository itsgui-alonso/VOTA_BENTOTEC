export class Usuario{
    constructor(id, qr_code, create_at, nome, cpf, email, telefone, tipoVisitante, origem, status){
        this._id = id
        this.qr_code = qr_code
        this.create_at = create_at
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
        return this.qr_code
    }

    get createAtUsuario(){
        return this.create_at
    }

    get nomeUsuario(){
        return this.nome
    }

    get usuarioCpf(){
        return this.cpf
    }

    get usuarioStatus(){
        return this.status
    }
}