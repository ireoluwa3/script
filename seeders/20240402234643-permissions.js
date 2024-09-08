"use strict";

const permissionsList = [
  "Access API Key Management",
  "Access Author Management",
  "Access Category Management",
  "Access Comment Management",
  "Access Media Management",
  "Access Post Management",
  "Access Tag Management",
  "Access KYC Application Management",
  "Access KYC Template Management",
  "Access Permission Management",
  "Access Role Management",
  "Access Support Ticket Management",
  "Access User Management",
  "Access Admin Dashboard",
  "Access MLM Referral Condition Management",
  "Access MLM Referral Management",
  "Access MLM Referral Reward Management",
  "Access AI Investment Duration Management",
  "Access AI Investment Management",
  "Access AI Investment Plan Management",
  "Access Ecommerce Category Management",
  "Access Ecommerce Discount Management",
  "Access Ecommerce Order Management",
  "Access Ecommerce Product Management",
  "Access Ecommerce Review Management",
  "Access Ecommerce Shipping Management",
  "Access Ecommerce Wishlist Management",
  "Access Futures Market Management",
  "Access Ecosystem Management",
  "Access Ecosystem Private Ledger Management",
  "Access Ecosystem Market Management",
  "Access Ecosystem Token Management",
  "Access Ecosystem UTXO Management",
  "Access Ecosystem Custodial Wallet Management",
  "Access Ecosystem Master Wallet Management",
  "Access FAQ Category Management",
  "Access FAQ Management",
  "Access Forex Account Management",
  "Access Forex Duration Management",
  "Access Forex Investment Management",
  "Access Forex Plan Management",
  "Access Forex Signal Management",
  "Access ICO Allocation Management",
  "Access ICO Contribution Management",
  "Access ICO Phase Management",
  "Access ICO Project Management",
  "Access ICO Token Management",
  "Access Mailwizard Campaign Management",
  "Access Mailwizard Template Management",
  "Access P2P Commission Management",
  "Access P2P Dispute Management",
  "Access P2P Escrow Management",
  "Access P2P Offer Management",
  "Access P2P Payment Method Management",
  "Access P2P Review Management",
  "Access P2P Trade Management",
  "Access Staking Duration Management",
  "Access Staking Management",
  "Access Staking Pool Management",
  "Access Fiat Currency Management",
  "Access Spot Currency Management",
  "Access Deposit Gateway Management",
  "Access Deposit Method Management",
  "Access Exchange Balance Management",
  "Access Exchange Fee Management",
  "Access Exchange Provider Management",
  "Access Exchange Market Management",
  "Access Investment Duration Management",
  "Access Investment Management",
  "Access Investment Plan Management",
  "Access Binary Order Management",
  "Access Ecosystem Order Management",
  "Access Exchange Order Management",
  "Access Transaction Management",
  "Access Wallet Management",
  "Access Withdrawal Method Management",
  "Access Pages Management",
  "Access Announcement Management",
  "Access Cron Job Management",
  "Access Database Backup Management",
  "Access Database Migration Management",
  "Access Extension Management",
  "Access Log Monitor",
  "Access Notification Template Management",
  "Access System Settings Management",
  "Access System Update Management",
  "Access Frontend Builder",
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const existingPermissions = await queryInterface.sequelize.query(
      "SELECT name FROM permission",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const existingPermissionNames = existingPermissions.map((p) => p.name);

    const newPermissions = permissionsList
      .filter((permission) => !existingPermissionNames.includes(permission))
      .map((permission) => ({
        name: permission,
      }));

    if (newPermissions.length > 0) {
      await queryInterface.bulkInsert("permission", newPermissions);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("permission", {
      name: permissionsList,
    });
  },
};
