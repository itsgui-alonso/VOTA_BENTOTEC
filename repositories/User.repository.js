
import prisma from "../database/prisma.js";
import { Usuario } from "../models/Usuario.js";

export class UserRepository {

    static async verificarQrCode(qrCodeEscaneado) {
        const qrCode = await prisma.user.findUnique({
            where: {
                qr_code: qrCodeEscaneado,
            },
        });

        if (!qrCode) {
            return null;
        }

        return new Usuario(qrCode)
    }

    static async upsertPorQrCode(dados) {
        const data = await prisma.user.upsert({
            where: {
                qr_code: dados.qrCode,
            },

            update: {
                nome: dados.nome,
                cpf: dados.cpf,
                email: dados.email,
                telefone: dados.telefone,
                tipoVisitante: dados.tipoVisitante,
                origem: dados.origem,
                status: dados.status,
            },

            create: {
                qr_code: dados.qrCode,
                nome: dados.nome,
                cpf: dados.cpf,
                email: dados.email,
                telefone: dados.telefone,
                tipoVisitante: dados.tipoVisitante,
                origem: dados.origem,
                status: dados.status,
            },
        });

        return new Usuario(data)
    }

    static async verificarStatus(statusUsuario, idUsuario){
        const usuario = await prisma.user.findFirst({
            where:{
                id: idUsuario,
                status: statusUsuario
            }
        })

        if(!usuario){
            return null
        }

        return new Usuario(usuario)
    }
}

