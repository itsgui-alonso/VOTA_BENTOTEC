import prisma from "../database/prisma.js";
import { Projeto } from "../models/Projetos.js";

export class ProjetoRepository{

    static async bucarProjetoID(projetoId){
        const projeto = await prisma.project.findFirst({
            where:{
                id: projetoId
            }
        })

        if(!projeto){
            return null
        }

        return new Projeto(
            projeto.id,
            projeto.name,
            projeto.description,
            projeto.categoryId
        )
    }

    static async bucarNomeProjeto(projetoName){
        const projeto = await prisma.project.findFirst({
            where:{
                name: projetoName
            }
        })

        if(!projeto){
            return null
        }

        return new Projeto(
            projeto.id,
            projeto.name,
            projeto.description,
            projeto.categoryId
        )
    }

    static async buscarProjetosCategoria(categoryId){
        const projetos = await prisma.project.findMany({
            where:{
                categoryId
            }
        })

        return projetos.map(projeto => new Projeto(
            projeto.id,
            projeto.name,
            projeto.description,
            projeto.categoryId
        ))
    }
}