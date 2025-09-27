// const { DataTypes } = require("sequelize");
// const sequelize = require("../config/database");

// const User = sequelize.define('User', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//     },
//     full_name: {
//         type: DataTypes.STRING(255),
//         allowNull: false,
//     },
//     email: {
//         type: DataTypes.STRING(255),
//         allowNull: false,
//         unique: true,
//         validate: {
//             isEmail: true,
//         },
//     },
//     password: {
//         type: DataTypes.TEXT,
//         allowNull: false,
//     },
//     role: {
//         type: DataTypes.STRING(50),
//         allowNull: false,
//         validate: {
//             isIn: [['admin', 'operator', 'technical']], // Enforce role validation
//         },
//         defaultValue: "admin",
//     },
// }, {
//     timestamps: true, // Disable Sequelize’s automatic `createdAt` and `updatedAt`
//     tableName: 'Users', // Explicitly define the table name
// });

// module.exports = User;