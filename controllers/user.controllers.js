import UsersDaoMysql from '../dao/users.dao.mysql.js';
import UserHelpers from './../helpers/user.helpers.js';

export default class UsersControllers {

    constructor() {
        this.usersdb = new UsersDaoMysql();
        this.helpers = new UserHelpers();
    }

    getAllUsers = async (req,res) => {
        const users = await this.usersdb.getAllUsers();
        res.status(200).json(users);
    }

    getUserById = async (req,res) => {
        const id = req.params.id;
        const user = await this.usersdb.getUserById(id);
        res.status(200).json(user);
    }

    getUserByDni = async (req,res) => {
        const dni = req.params.dni;
        const user = await this.usersdb.getUserByDni(dni);
        res.status(200).json(user);
    }

    createUser = async (req,res) => {
        const user = this.helpers.parseUser(req.body);
        const result = await this.usersdb.createUser(user);
        res.status(201).json(result);
    }

    updateUser = async (req,res) => {
        const user = this.helpers.parseUser(req.body);
        const result = await this.usersdb.updateUser(user)
        res.status(200).json(result);
    }

    deleteUser = async (req,res) => {
        const { id } = req.params;
        const result = await this.usersdb.deleteUser(id);
        res.status(200).json(result);
    }

}


