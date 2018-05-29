module.exports = function(sequelize, DataTypes) {
	let CharacterAccount = sequelize.define('CharacterAccount', {
			name: { type: DataTypes.STRING, allowNull: false },
			pgid: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true},
			disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
		}, {
		classMethods: {
			associate: function(models) {
				CharacterAccount.belongsTo(models.Account)
			}
		}
	})

	return CharacterAccount
}
