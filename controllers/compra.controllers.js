import CompraDaoMysql from '../dao/compra.dao.mysql.js'
import CompraHelpers from './../helpers/compra.helpers.js';
import PerfumeHelpers from './../helpers/perfume.helpers.js';
import RecitalHelpers from './../helpers/recital.helpers.js';
import UserHelpers from '../helpers/user.helpers.js';

export default class CompraControllers {

    constructor() {
        this.compradb = new CompraDaoMysql();
        this.helpers = new CompraHelpers();
        this.userHelpers = new UserHelpers();
        this.perfumeHelpers = new PerfumeHelpers();
        this.recitalHelpers = new RecitalHelpers();
    }

    getAllCompras = async (req,res) => {
        const compras = await this.compradb.getAllCompras();
        res.status(200).json(compras);
    }

    getCompraById = async (req,res) => {
        const id = req.params.id;
        const compra = await this.compradb.getCompraById(id);
        res.status(200).json(compra);
    }

    createCompra = async (req, res) => {
        const { dni, codigo_perfume, codigo_recital } = req.query;

        if (!codigo_perfume && !codigo_recital) {
            res.status(400).json({ error: 'Debe proporcionar un código de perfume o recital para crear una compra.' });
            return;
        } 
        
        let compraData;

        if (codigo_perfume && codigo_recital) {
            compraData = await this.compradb.createCompraWithBoth(dni, codigo_perfume, codigo_recital);
        } else if (codigo_perfume) {
            compraData = await this.compradb.createCompraWithPerfume(dni, codigo_perfume);
        } else if (codigo_recital) {
            compraData = await this.compradb.createCompraWithRecital(dni, codigo_recital);
        }

        res.status(201).json(compraData);
    }

    updateCompra = async (req,res) => {
        const compra = this.helpers.parseCompra(req.body);
        const result = await this.compradb.updateCompra(compra);
        res.status(200).json(result);
    }


    deleteCompra = async (req,res) => {
        const id = req.params.id;
        const result = await this.compradb.deleteCompra(id);
        res.status(200).json(result);
    }

    deleteAllCompras = async (req,res) => {
        const result = await this.compradb.deleteAllCompras();
        res.status(200).json(result);
    }

}







