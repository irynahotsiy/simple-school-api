/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "students",
    {
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      student_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "groups",
          key: "group_id",
        },
      },
    },
    {
      tableName: "students",
      timestamps: false,
    }
  );
};
