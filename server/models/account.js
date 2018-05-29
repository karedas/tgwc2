const crypto = require('crypto-js');
const uuid = require('uuid');
const validator = require('validator');

module.exports = function(sequelize, DataTypes) {
	let Account = sequelize.define('Account', {
			
			disabled:				{ type: DataTypes.BOOLEAN,		defaultValue: false },
			
			local_email:			{ type: DataTypes.STRING,		allowNull:true, validate: { isEmail: true } },
			local_password:			{ type: DataTypes.STRING(128),	allowNull:true },
			local_name:				{ type: DataTypes.STRING(32),	allowNull:true, validate: { len: [3,32] } },
			local_token:			{ type: DataTypes.UUID,			allowNull:true },
			local_verified:			{ type: DataTypes.BOOLEAN,		allowNull:true, defaultValue: false },
			local_ip_request:		{ type: DataTypes.STRING(15),	allowNull:true, validate: { isIPv4: true } },
			
			facebook_app_id:		{ type: DataTypes.STRING,		allowNull:true },
			facebook_canvas_id:		{ type: DataTypes.STRING,		allowNull:true },
			facebook_token:			{ type: DataTypes.UUID,			allowNull:true },
			facebook_email:			{ type: DataTypes.STRING,		allowNull:true, validate: { isEmail: true } },
			facebook_name:			{ type: DataTypes.STRING,		allowNull:true }

		}, {
		classMethods: {
			associate: function(models) {
				Account.hasMany(models.CharacterAccount, {
					as: 'Characters'
				})
			},
			generateHash: function(password) {
				return bcrypt.hashSync(password, bcrypt.genSaltSync());
			},
			generateToken: function() {
				return uuid.v4();
			},
			validPassword: function(password) {
				return validator.isLength(password, 8, 32);
			},
			validName: function(name) {
				return validator.isLength(name, 3, 32);
			},
			generatePassword: function() {
				let length = 8;
				let validChars = "23456789abcdefghkmnpqrstuvwz";
				let password = "";
				
				while (password.length < length)
				{
					let newChar = Math.floor(Math.random() * validChars.length);
					password += validChars[newChar];
				}
				
				return password;
			}
		},
		instanceMethods: {
			correctPassword: function(password) {
				return password && this.local_password && bcrypt.compareSync(password, this.local_password);
			},
			canUnlink: function() {
				return this.local_email != null && (this.facebook_canvas_id != null || this.facebook_app_id != null);
			},
			hasLocal: function() {
				return !this.disabled && this.local_verified == true;
			},
			canLoginLocal: function() {
				return !this.disabled && this.local_verified == true;
			},
			hasFacebook: function() {
				return !this.disabled && (this.facebook_canvas_id != null || this.facebook_app_id != null);
			},
			canLoginFacebook: function() {
				return !this.disabled && (this.facebook_canvas_id != null || this.facebook_app_id != null);
			},
			name: function() {
				if (this.facebook_name)
					return this.facebook_name;
				if (this.local_name)
					return this.local_name;
				return 'unknown';
			},
			email: function() {
				if (this.local_email)
					return this.local_email;
				if (this.facebook_email)
					return this.facebook_email;
				return '';
			}
		}
	})

	return Account
}
