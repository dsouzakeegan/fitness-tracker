const mongoose = require("mongoose");

const { Role } = require("../models/models.index");

class RoleService {
    async addRole(request) {
        return new Promise(async (resolve, reject) => { 
            try {
                const { title } = request.body;

                const duplicateTitle = await Role.findOne({ title })
                if( duplicateTitle ){
                    return resolve({
                        status: false,
                        message: 'Title already exists!'
                    })
                }
                const createdRole = await Role.create({
                    title: title
                })
                return resolve({ status: true, data: createdRole, message: "Role added successfully!" });
            }
            catch(error) {
                return reject(error);
            }
        });
    }

    async updateRole(request) {
        return new Promise(async (resolve, reject) => {
            try {
                const { _id, title } = request.body

                const foundRole = await Role.findOne({ _id, isDeleted: false })

                const duplicateTitle = await Role.findOne({ _id: { $ne: _id }, title })
                if( duplicateTitle ){
                    return resolve({
                        status: false,
                        message: 'Title already exists!'
                    })
                }
                if( !foundRole ){
                    return resolve({ status: false, message: "Role does not exist!" })
                }

                const roleObject = {  }

                if( title ){
                    roleObject.title = title
                }

                const updateRole = await Role.findOneAndUpdate( { _id }, { $set: roleObject }, { new: true } );

                if( !updateRole ){
                    return resolve({ status: false, message: `Role not updated!` })
                }

                return resolve({ status: true, data: updateRole, message: "Role updated successfully!" });
            }
            catch(error) {
                return reject(error);
            }
        });
    }

    async deleteRole(request) {
        return new Promise(async (resolve, reject) => {
            try {
                const { _id } = request.params
        
                const foundRole = await Role.findOne({ _id })

                if( !foundRole ){
                    return resolve({ status: false, message: "Role does not exist!" })
                }

                if( foundRole.isDeleted === true ){
                    return resolve({ status: false, message: "Role has already been deleted!" })
                }

                const deletedRole = await Role.findOneAndUpdate( { _id }, { $set: { isDeleted: true } }, { new: true } );

                if( !deletedRole ){
                    return resolve({ status: false, message: `Role not deleted!` })
                }

                return resolve({ status: true, data: deletedRole, message: "Role deleted successfully!" });
            }
            catch(error) {
                return reject(error);
            }
        });
    }

    async getRoleList(request) {
        return new Promise(async (resolve, reject) => {
            try {
                const { limit, page, noLimit } = request.query;
                let pagination, fetchedRoleList = []
                let condition = { isDeleted: false }
                
                if( noLimit === "true" ){
        
                  fetchedRoleList = await Role.find(condition)
        
                } else {
                  const limitValue = parseInt(limit) || 10;
                  const skipValue = page ? (parseInt(page) - 1) * limitValue : 0;
        
                  fetchedRoleList = await Role.find(condition).limit(limitValue).skip(skipValue)
                  const count = await Role.countDocuments(condition)
        
                  pagination = {
                    noOfPages: Math.ceil((count) / limitValue),
                    currentPage: parseInt(request.query.page) || 1,
                    numOfResults: count
                  }
        
                }

                return resolve({ status: true, data: fetchedRoleList, pagination, message: "Roles fetched successfully!" });
            }
            catch(error) {
                return reject(error);
            }
        });
    }
}

module.exports = RoleService;