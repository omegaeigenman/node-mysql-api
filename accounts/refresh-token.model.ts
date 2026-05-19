import { Sequelize, DataTypes } from 'sequelize';

export default function refreshTokenModel(sequelize: Sequelize) {
  const attributes = {
    token: { type: DataTypes.STRING },
    expires: { type: DataTypes.DATE },
    created: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    createdByIp: { type: DataTypes.STRING },
    revoked: { type: DataTypes.DATE },
    revokedByIp: { type: DataTypes.STRING },
    replacedByToken: { type: DataTypes.STRING },
    isExpired: {
      type: DataTypes.VIRTUAL,
      get(this: any) {
        return Date.now() >= new Date(this.expires).getTime();
      },
    },
    isActive: {
      type: DataTypes.VIRTUAL,
      get(this: any) {
        return !this.revoked && !this.isExpired;
      },
    },
  };

  const options = {
    // disable default timestamp fields (createdAt and updatedAt)
    timestamps: false,
  };

  return sequelize.define('refreshToken', attributes, options);
}
