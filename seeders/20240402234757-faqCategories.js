"use strict";

const faqCategories = [
  "BINARY",
  "AI_INVESTMENT",
  "FOREX",
  "ICO",
  "ECOSYSTEM",
  "FRONTEND",
  "STAKING",
  "MLM",
  "P2P",
  "ECOMMERCE",
  "MAILWIZARD",
  "KYC",
  "INVESTMENT",
  "DEPOSIT_SPOT",
  "DEPOSIT_FIAT",
  "WIDTHDRAW_SPOT",
  "WIDTHDRAW_FIAT",
  "TRANSFER",
].map((id) => id.toUpperCase());

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch existing FAQ categories to prevent duplicates
    const existingCategories = await queryInterface.sequelize.query(
      "SELECT id FROM faq_category",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const existingCategoryIdentifiers = new Set(
      existingCategories.map((category) => category.id)
    );

    // Filter out categories that already exist and assign a UUID to each new one
    const newCategories = faqCategories
      .filter((id) => !existingCategoryIdentifiers.has(id))
      .map((id) => ({
        id,
      }));

    // Only proceed with insertion if there are new categories to add
    if (newCategories.length > 0) {
      await queryInterface.bulkInsert("faq_category", newCategories, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("faq_category", null, {});
  },
};
