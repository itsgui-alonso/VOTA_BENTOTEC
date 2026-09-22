import prisma from "../database/prisma.js";
import { IntegrantesPr } from "../models/IntegrantesPr.js"

export class IntegrantesPrRepository{

    static async nomeIntegrantePr(nomeIntegrante){
        const integrante = await prisma.integrantes.findFirst({
            where: {
                nome: nomeIntegrante
            }
        })

        if(!integrante){
            return null
        }

        return new IntegrantesPr(integrante)
    }

}