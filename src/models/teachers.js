/* jshint indent: 2 */

module.exports = function teachers(sequelize, DataTypes) {
  return sequelize.define(
    'teachers',
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
    },
    {
      tableName: 'teachers',
      timestamps: false,
    },
  );
};
