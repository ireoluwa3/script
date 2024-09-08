"use strict";
const { v4: uuidv4 } = require("uuid");

const DepositGateways = [
  {
    name: "Stripe",
    title: "Stripe",
    description: "Payment gateway for credit cards",
    alias: "stripe",
    type: "FIAT",
    image: "/img/gateways/stripe.png",
    currencies: [
      "USD",
      "AUD",
      "BRL",
      "CAD",
      "CHF",
      "DKK",
      "EUR",
      "GBP",
      "HKD",
      "INR",
      "JPY",
      "MXN",
      "MYR",
      "NOK",
      "NZD",
      "PLN",
      "SEK",
      "SGD",
    ],
    status: true,
    version: "0.0.1",
  },
  {
    name: "PayPal",
    title: "PayPal",
    description: "Payment gateway for PayPal",
    alias: "paypal",
    type: "FIAT",
    image: "/img/gateways/paypal.png",
    currencies: [
      "AUD",
      "BRL",
      "CAD",
      "CZK",
      "DKK",
      "EUR",
      "HKD",
      "HUF",
      "INR",
      "ILS",
      "JPY",
      "MYR",
      "MXN",
      "TWD",
      "NZD",
      "NOK",
      "PHP",
      "PLN",
      "GBP",
      "RUB",
      "SGD",
      "SEK",
      "CHF",
      "THB",
      "USD",
    ],
    status: false,
    version: "0.0.1",
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch existing deposit gateway names to compare against
    const existingGateways = await queryInterface.sequelize.query(
      "SELECT name FROM deposit_gateway",
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    const existingNames = new Set(
      existingGateways.map((gateway) => gateway.name)
    );

    // Filter out DepositGateways that already exist in the database by name
    const newGateways = DepositGateways.filter(
      (gateway) => !existingNames.has(gateway.name)
    ).map((gateway) => ({
      ...gateway,
      id: uuidv4(),
      currencies: JSON.stringify(gateway.currencies),
      fixedFee: gateway.fixedFee || 0,
      percentageFee: gateway.percentageFee || 0,
      minAmount: gateway.minAmount || 0,
      maxAmount: gateway.maxAmount || null,
      productId: gateway.productId || null,
    }));

    // Only insert new gateways that do not exist
    if (newGateways.length > 0) {
      await queryInterface.bulkInsert("deposit_gateway", newGateways, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("deposit_gateway", null, {});
  },
};
