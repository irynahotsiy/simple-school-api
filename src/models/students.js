/* jshint indent: 2 */

module.exports = function students(sequelize, DataTypes) {
  return sequelize.define(
    'students',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
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
          model: 'groups',
          key: 'id',
        },
      },
    },
    {
      tableName: 'students',
      timestamps: false,
    },
  );
};
