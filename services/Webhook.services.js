import { AppError } from "../models/errors/AppError.js";
import { UserRepository } from "../repositories/User.repository.js";

export class WebhookService {
    static async processarCadastro(payload) {
        const { record } = payload

        if(!record || !record.qr_texto){
            throw new AppError('Payload é inválido! qr_texto ausente', 400);
        }

        return await UserRepository.upsertPorQrCode({
            qrCode: record.qr_texto,
            nome: record.nome,
            cpf: record.cpf,
            email: record.email,
            telefone: record.telefone,
            tipoVisitante: record.tipoVisitante,
            origem: record.origem,
            status: record.status
        })
    }
}