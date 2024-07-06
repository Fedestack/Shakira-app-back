import Mysql from '../db/connections/mysql.js';

export default class CompraDaoMysql extends Mysql {

    constructor() {
        super();
        this.table = 'compras';
        this.oldCompra = {};
    }

    async getAllCompras() {
        const query = `SELECT * FROM ${this.table}`;
        const [result] = await this.connection.promise().query(query);
        return result;
    }

    async getCompraById(id) {
        const query = `SELECT * FROM ${this.table} WHERE ID = ${id}`;
        const [result] = await this.connection.promise().query(query);
        return result;
    }

    async generateNumeroDeCompra() {
        const query = `SELECT COALESCE(MAX(numero_de_compra), 0) + 1 AS nuevo_numero FROM ${this.table}`;
        const [result] = await this.connection.promise().query(query);
        return result[0].nuevo_numero;
    }


    async createCompraWithBoth(dni, codigo_perfume, codigo_recital) {
        const perfumeQuery = `SELECT * FROM PERFUMES WHERE codigo_perfume = ?`;
        const [perfume] = await this.connection.promise().query(perfumeQuery, [codigo_perfume]);

        if (!perfume.length) {
            throw new Error('Perfume no encontrado.');
        }

        const recitalQuery = `SELECT * FROM RECITALES WHERE codigo_recital = ?`;
        const [recital] = await this.connection.promise().query(recitalQuery, [codigo_recital]);

        if (!recital.length) {
            throw new Error('Recital no encontrado.');
        }

        const userQuery = `SELECT * FROM USUARIO WHERE dni = ?`;
        const [usuario] = await this.connection.promise().query(userQuery, [dni]);

        if (!usuario.length) {
            throw new Error('Usuario no encontrado.');
        }

        const fecha_de_compra = new Date().toISOString().slice(0, 10);
        const precio_perfume = perfume[0].precio_perfume;
        const precio_entrada = recital[0].precio_entrada;
        const monto_total = precio_perfume + precio_entrada;

        // Generar el número de compra
        const numero_de_compra = await this.generateNumeroDeCompra();
        console.log(numero_de_compra);

        const compraQuery = `INSERT INTO ${this.table} (numero_de_compra, fecha_de_compra, dni_cliente, codigo_perfume, codigo_recital, precio_perfume, precio_entrada, monto_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await this.connection.promise().query(compraQuery, [numero_de_compra,fecha_de_compra, dni, codigo_perfume, codigo_recital, precio_perfume, precio_entrada, monto_total]);

        return {
            numero_de_compra:result.insertId,
            fecha_de_compra,
            dni_cliente: dni,
            codigo_perfume,
            codigo_recital,
            precio_perfume,
            precio_entrada,
            monto_total
        };

    }

    async createCompraWithPerfume(dni, codigo_perfume) {
        const perfumeQuery = `SELECT * FROM PERFUMES WHERE codigo_perfume = ?`;
        const [perfume] = await this.connection.promise().query(perfumeQuery, [codigo_perfume]);

        if (!perfume.length) {
            throw new Error('Perfume no encontrado.');
        }

        const userQuery = `SELECT * FROM USUARIO WHERE dni = ?`;
        const [usuario] = await this.connection.promise().query(userQuery, [dni]);

        if (!usuario.length) {
            throw new Error('Usuario no encontrado.');
        }

        const fecha_de_compra = new Date().toISOString().slice(0, 10);
        const precio_perfume = perfume[0].precio_perfume;
        const monto_total = precio_perfume;

        // Generar el número de compra
        const numero_de_compra = await this.generateNumeroDeCompra();

        const compraQuery = `INSERT INTO COMPRAS (numero_de_compra, fecha_de_compra, dni_cliente, codigo_perfume, precio_perfume, monto_total) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await this.connection.promise().query(compraQuery, [numero_de_compra, fecha_de_compra, dni, codigo_perfume, precio_perfume, monto_total]);


        return {
            numero_de_compra: result.insertId,
            fecha_de_compra,
            dni_cliente: dni,
            codigo_perfume,
            precio_perfume,
            monto_total
        };
    }

    async createCompraWithRecital(dni, codigo_recital) {
        const recitalQuery = `SELECT * FROM RECITALES WHERE codigo_recital = ?`;
        const [recital] = await this.connection.promise().query(recitalQuery, [codigo_recital]);

        if (!recital.length) {
            throw new Error('Recital no encontrado.');
        }

        const userQuery = `SELECT * FROM USUARIO WHERE dni = ?`;
        const [usuario] = await this.connection.promise().query(userQuery, [dni]);

        if (!usuario.length) {
            throw new Error('Usuario no encontrado.');
        }

        const fecha_de_compra = new Date().toISOString().slice(0, 10);
        const precio_entrada = recital[0].precio_entrada;
        const monto_total = precio_entrada;

         // Generar el número de compra
        const numero_de_compra = await this.generateNumeroDeCompra();

        const compraQuery = `INSERT INTO COMPRAS (numero_de_compra, fecha_de_compra, dni_cliente, codigo_recital, precio_entrada, monto_total) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await this.connection.promise().query(compraQuery, [numero_de_compra, fecha_de_compra, dni, codigo_recital, precio_entrada, monto_total]);

        return {
            numero_de_compra: result.insertId,
            fecha_de_compra,
            dni_cliente: dni,
            codigo_recital,
            precio_entrada,
            monto_total
        };
    }

    async createCompra(numero_de_compra, fecha_de_compra, dni, codigo_perfume, codigo_recital, precio_perfume, precio_entrada, monto_total) {
        const query = `INSERT INTO ${this.table} (numero_de_compra, fecha_de_compra, dni_cliente, codigo_perfume,codigo_recital, precio_perfume, precio_entrada, monto_total) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await this.connection.promise().query(query, [numero_de_compra, fecha_de_compra, dni, codigo_perfume, codigo_recital, precio_perfume, precio_entrada, monto_total]);
        return result.insertId;
    }

    async updateCompra(compra) {
        let perfumeData, recitalData;

        
        if (compra.codigo_perfume !== this.oldCompra.codigo_perfume) {
            
            const perfumeQuery = `
            SELECT precio_perfume
            FROM perfumes
            WHERE codigo_perfume =?`;
            [[perfumeData]] = await this.connection.promise().query(perfumeQuery, [compra.codigo_perfume]);
        }

        
        if (compra.codigo_recital !== this.oldCompra.codigo_recital) {
            
            const recitalQuery = `
            SELECT precio_entrada
            FROM recitales
            WHERE codigo_recital =?`;
            [[recitalData]] = await this.connection.promise().query(recitalQuery, [compra.codigo_recital]);
            console.log(recitalData);
        }

        
        const query = `UPDATE ${this.table} SET 
                        codigo_perfume =?, 
                        codigo_recital =?, 
                        precio_perfume =?, 
                        precio_entrada =?
                        WHERE id =?`;
        const [result] = await this.connection.promise().query(query, [
            compra.codigo_perfume,
            compra.codigo_recital,
            perfumeData ? perfumeData.precio_perfume : this.oldCompra.precio_perfume,
            recitalData ? recitalData.precio_entrada : this.oldCompra.precio_entrada,
            compra.id]);

            const montoTotal = (perfumeData? perfumeData.precio_perfume : 0) + (recitalData? recitalData.precio_entrada : 0);
            const updateMontoTotalQuery = `UPDATE ${this.table} SET monto_total =? WHERE id =?`;
            await this.connection.promise().query(updateMontoTotalQuery, [montoTotal, compra.id]);

        return result;
    }

    async deleteCompra (id) {
        const query = `DELETE FROM ${this.table} WHERE id = ${id}`;
        const [result] = await this.connection.promise().query(query);
        return result;
    }

    async deleteAllCompras () {
        const query = `DELETE FROM ${this.table}`;
        const [result] = await this.connection.promise().query(query);
        return result;

}
}
