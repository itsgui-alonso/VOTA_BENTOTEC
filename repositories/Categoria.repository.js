import prisma from "../database/prisma";
import { Categoria } from "../models/Categoria";

export class CategoriaRepository {
    static async listarTodas(){
        const categorias = await prisma.categoria.findMany({ orderBy: { id: 'asc' } }) // todas em ordem de id
        return categorias.map(categoria => new Categoria(categoria))
    }
}