import { v4 as uuidv4 } from "uuid";

export const tableConfigs = [
  {
    oldTable: "user",
    newTable: "user",
    hasUuid: true,
    transform: (record, idMapping, tableName) => {
      if (!record.email || !record.uuid) {
        return null; // Skip record if email or uuid is missing
      }

      const oldId = record.id || record.uuid; // Ensure oldId is always valid
      const newId = record.uuid;
      idMapping[`${tableName}_${oldId}`] = newId;

      const transformedRecord = {
        id: newId,
        email: record.email,
        password: record.password,
        avatar: record.avatar,
        firstName: record.first_name,
        lastName: record.last_name,
        emailVerified:
          record.email_verified !== undefined
            ? record.email_verified === "1"
            : false,
        lastLogin: record.last_login ? new Date(record.last_login) : null,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
        deletedAt: record.deleted_at ? new Date(record.deleted_at) : null,
        roleId: 4,
        failedLoginAttempts: 0,
        lastFailedLogin: null,
        status: true,
        phone: record.phone,
      };

      return transformedRecord;
    },
  },
  {
    oldTable: "wallet",
    newTable: "wallet",
    hasUuid: true,
    transform: (record, idMapping, tableName) => {
      if (record.balance <= 0 && record.type !== "ECO") {
        return null;
      }
      const userId = idMapping[`user_${record.user_id}`];
      if (!userId || !record.uuid) {
        return null; // Skip if userId is not found in idMapping or uuid is missing
      }

      const newId = record.uuid;
      idMapping[`${tableName}_${record.id}`] = newId;

      const createdAt = record.created_at
        ? new Date(record.created_at)
        : new Date();
      const updatedAt = record.updated_at
        ? new Date(record.updated_at)
        : new Date();

      const transformedRecord: any = {
        id: newId,
        userId: userId,
        type: record.type,
        currency: record.currency,
        balance: record.balance,
        inOrder: record.in_order,
        status: record.status,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      if (typeof record.addresses === "string") {
        try {
          // Unescape the JSON string
          const unescapedAddresses = record.addresses.replace(
            /\\([\s\S])/g,
            "$1"
          );
          transformedRecord.address = JSON.parse(unescapedAddresses);
        } catch (e) {
          console.error(`Failed to parse address JSON: ${record.addresses}`);
          transformedRecord.address = null;
        }
      } else {
        transformedRecord.address = record.addresses;
      }

      // Ensure address is stored as a JSON string
      if (transformedRecord.address) {
        transformedRecord.address = JSON.stringify(transformedRecord.address);
      }

      return transformedRecord;
    },
  },

  {
    oldTable: "wallet_data",
    newTable: "wallet_data",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const walletId = idMapping[`wallet_${record.wallet_id}`];
      if (!walletId) {
        return null; // Skip if walletId is not found in idMapping
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        walletId: walletId,
        currency: record.currency,
        chain: record.chain,
        balance: record.balance,
        index: record.index,
        data: record.data,
      };
    },
  },
  {
    oldTable: "transaction",
    newTable: "transaction",
    hasUuid: true,
    transform: (record, idMapping, tableName) => {
      const userId = idMapping[`user_${record.user_id}`];
      const walletId = idMapping[`wallet_${record.wallet_id}`];

      if (!userId || !walletId || !record.uuid) {
        return null; // Skip if userId or walletId is not found in idMapping or uuid is missing
      }

      const newId = record.uuid;
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        userId: userId,
        walletId: walletId,
        type: record.type,
        status: record.status,
        amount: record.amount,
        fee: record.fee,
        description: record.description,
        metadata: record.metadata,
        referenceId: record.reference_id,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },
  {
    oldTable: "ecommerce_category",
    newTable: "ecommerce_category",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      if (!record.name) {
        return null;
      }
      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;
      return {
        id: newId,
        name: record.name,
        description: record.description,
        image: record.image,
        status: true,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },
  {
    oldTable: "ecosystem_custodial_wallet",
    newTable: "ecosystem_custodial_wallet",
    hasUuid: true,
    transform: (record, idMapping, tableName) => {
      const masterWalletId =
        idMapping[`ecosystem_master_wallet_${record.master_wallet_id}`];
      if (!masterWalletId || !record.uuid) {
        return null; // Skip if masterWalletId is not found in idMapping or uuid is missing
      }

      const newId = record.uuid;
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        masterWalletId: masterWalletId,
        address: record.address,
        chain: record.chain,
        network: record.network,
        status: record.status,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
      };
    },
  },
  {
    oldTable: "ecosystem_master_wallet",
    newTable: "ecosystem_master_wallet",
    hasUuid: true,
    transform: (record, idMapping, tableName) => {
      if (!record.uuid) {
        return null;
      }

      const newId = record.uuid;
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        chain: record.chain,
        currency: record.currency,
        address: record.address,
        balance: record.balance,
        data: record.data,
        status: record.status,
        lastIndex: record.last_index,
      };
    },
  },
  {
    oldTable: "ecosystem_private_ledger",
    newTable: "ecosystem_private_ledger",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const walletId =
        idMapping[`ecosystem_custodial_wallet_${record.wallet_id}`];
      if (!walletId) {
        return null; // Skip if walletId is not found in idMapping
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        walletId: walletId,
        index: record.index,
        currency: record.currency,
        chain: record.chain,
        network: record.network,
        offchainDifference: record.offchain_difference,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },
  {
    oldTable: "ecosystem_market",
    newTable: "ecosystem_market",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      let metadata = null;
      if (typeof record.metadata === "string") {
        try {
          // Unescape the JSON string
          const unescapedMetadata = record.metadata.replace(
            /\\([\s\S])/g,
            "$1"
          );
          metadata = JSON.parse(unescapedMetadata);
        } catch (e) {
          console.error(`Failed to parse metadata JSON: ${record.metadata}`);
        }
      } else {
        metadata = record.metadata;
      }

      return {
        id: newId,
        currency: record.symbol.split("/")?.[0],
        pair: record.pair,
        isTrending: record.is_trending,
        isHot: record.is_hot,
        metadata: metadata ? JSON.stringify(metadata) : null,
        status: record.status,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },
  {
    oldTable: "ecosystem_token",
    newTable: "ecosystem_token",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      if (!record.contractType) {
        return null;
      }

      let limits = null;
      if (typeof record.limits === "string") {
        try {
          // Unescape the JSON string
          const unescapedLimits = record.limits.replace(/\\([\s\S])/g, "$1");
          limits = JSON.parse(unescapedLimits);
        } catch (e) {
          console.error(`Failed to parse limits JSON: ${record.limits}`);
        }
      } else {
        limits = record.limits;
      }

      let fee = null;
      if (typeof record.fees === "string") {
        try {
          // Unescape the JSON string
          const unescapedFee = record.fees.replace(/\\([\s\S])/g, "$1");
          fee = JSON.parse(unescapedFee);
        } catch (e) {
          console.error(`Failed to parse fee JSON: ${record.fees}`);
        }
      } else {
        fee = record.fees;
      }

      return {
        id: newId,
        contract: record.contract,
        name: record.name,
        currency: record.currency,
        chain: record.chain,
        network: record.network,
        type: record.type,
        decimals: Number(record.decimals || 0),
        status: false,
        precision: Number(record.precision || null),
        limits: limits ? JSON.stringify(limits) : null,
        fee: fee ? JSON.stringify(fee) : null,
        icon: record.icon,
        contractType: record.contractType,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },

  {
    oldTable: "ecosystem_utxo",
    newTable: "ecosystem_utxo",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const walletId =
        idMapping[`ecosystem_custodial_wallet_${record.wallet_id}`];
      if (!walletId) {
        return null; // Skip if walletId is not found in idMapping
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        walletId: walletId,
        transactionId: record.transaction_id,
        index: record.index,
        amount: record.amount,
        script: record.script,
        status: record.status,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },
  {
    oldTable: "exchange_orders",
    newTable: "exchange_order",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const userId = idMapping[`user_${record.user_id}`];
      if (!userId) {
        return null; // Skip if userId is not found in idMapping
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      let trades = null;
      if (typeof record.trades === "string") {
        try {
          // Unescape the JSON string
          const unescapedTrades = record.trades.replace(/\\([\s\S])/g, "$1");
          trades = JSON.parse(unescapedTrades);
        } catch (e) {
          console.error(`Failed to parse trades JSON: ${record.trades}`);
        }
      } else {
        trades = record.trades;
      }

      return {
        id: newId,
        referenceId: record.uuid,
        userId: userId,
        symbol: record.symbol,
        side: record.side,
        type: record.type,
        status: record.status,
        price: record.price,
        amount: record.amount,
        filled: record.filled,
        remaining: record.remaining,
        cost: record.cost,
        fee: record.fee,
        feeCurrency: record.fee_currency,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
        average: record.average,
        timeInForce: record.timeInForce,
        trades: trades ? JSON.stringify(trades) : null,
      };
    },
  },
  {
    oldTable: "forex_account",
    newTable: "forex_account",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const userId = idMapping[`user_${record.user_id}`];
      if (!userId) {
        return null; // Skip if userId is not found in idMapping
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        userId: userId,
        accountId: record.account_id,
        password: record.password,
        broker: record.broker,
        mt: record.mt ? parseInt(record.mt) || null : null, // Handle empty or invalid mt values
        balance: record.balance,
        leverage: record.leverage,
        type: record.type,
        status: record.status,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },
  {
    oldTable: "forex_duration",
    newTable: "forex_duration",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        duration: record.duration,
        timeframe: record.timeframe,
      };
    },
  },
  {
    oldTable: "forex_investment",
    newTable: "forex_investment",
    hasUuid: true,
    transform: (record, idMapping, tableName) => {
      const userId = idMapping[`user_${record.user_id}`];
      const planId = idMapping[`forexPlan_${record.plan_id}`];
      const durationId = idMapping[`forexDuration_${record.duration_id}`];

      if (!userId || !planId || !durationId || !record.uuid) {
        return null; // Skip if userId, planId, or durationId is not found in idMapping or uuid is missing
      }

      const newId = record.uuid;
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        userId: userId,
        planId: planId,
        durationId: durationId,
        amount: record.amount,
        profit: record.profit,
        result: record.result,
        status: record.status,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
        endDate: record.end_date ? new Date(record.end_date) : null,
      };
    },
  },
  {
    oldTable: "forex_plan",
    newTable: "forex_plan",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        name: record.name,
        title: record.title,
        description: record.description,
        image: record.image,
        minProfit: record.min_profit,
        maxProfit: record.max_profit,
        minAmount: record.min_amount,
        maxAmount: record.max_amount,
        invested: record.invested,
        profitPercentage: record.profit_percentage,
        status: false,
        defaultProfit: record.default_profit,
        defaultResult: record.default_result,
        trending: record.trending,
        currency: "USDT",
        WalletType: "SPOT",
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },
  {
    oldTable: "forex_plan_duration",
    newTable: "forex_plan_duration",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const planId = idMapping[`forexPlan_${record.plan_id}`];
      const durationId = idMapping[`forexDuration_${record.duration_id}`];

      if (!planId || !durationId) {
        return null; // Skip if planId or durationId is not found in idMapping
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        planId: planId,
        durationId: durationId,
      };
    },
  },
  {
    oldTable: "ico_allocation",
    newTable: "ico_allocation",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const tokenId = idMapping[`icoToken_${record.token_id}`];
      if (!tokenId) {
        return null; // Skip if tokenId is not found in idMapping
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        name: record.name,
        percentage: record.percentage,
        tokenId: tokenId,
        status: record.status,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },
  {
    oldTable: "ico_contribution",
    newTable: "ico_contribution",
    hasUuid: true,
    transform: (record, idMapping, tableName) => {
      const userId = idMapping[`user_${record.user_id}`];
      const phaseId = idMapping[`icoPhase_${record.phase_id}`];

      if (!userId || !phaseId || !record.uuid) {
        return null; // Skip if userId or phaseId is not found in idMapping or uuid is missing
      }

      const newId = record.uuid;
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        userId: userId,
        phaseId: phaseId,
        amount: record.amount,
        status: record.status,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },
  {
    oldTable: "ico_phase",
    newTable: "ico_phase",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const tokenId = idMapping[`icoToken_${record.token_id}`];
      if (!tokenId) {
        return null; // Skip if tokenId is not found in idMapping
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        name: record.name,
        startDate: new Date(record.start_date),
        endDate: new Date(record.end_date),
        price: record.price,
        status: record.status,
        tokenId: tokenId,
        minPurchase: record.min_purchase,
        maxPurchase: record.max_purchase,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },
  {
    oldTable: "ico_phase_allocation",
    newTable: "ico_phase_allocation",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const allocationId = idMapping[`icoAllocation_${record.allocation_id}`];
      const phaseId = idMapping[`icoPhase_${record.phase_id}`];

      if (!allocationId || !phaseId) {
        return null; // Skip if allocationId or phaseId is not found in idMapping
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        allocationId: allocationId,
        phaseId: phaseId,
        percentage: record.percentage,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },
  {
    oldTable: "ico_project",
    newTable: "ico_project",
    hasUuid: true,
    transform: (record, idMapping, tableName) => {
      if (!record.uuid) {
        return null;
      }

      const newId = record.uuid;
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        name: record.name,
        description: record.description,
        website: record.website,
        whitepaper: record.whitepaper,
        image: record.image,
        status: "PENDING",
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },
  {
    oldTable: "ico_token",
    newTable: "ico_token",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const projectId = idMapping[`icoProject_${record.project_id}`];
      if (!projectId) {
        return null; // Skip if projectId is not found in idMapping
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        name: record.name,
        chain: record.chain,
        currency: record.currency,
        purchaseCurrency: record.purchase_currency,
        purchaseWalletType: record.purchase_wallet_type,
        address: record.address,
        totalSupply: record.total_supply,
        description: record.description,
        image: record.image,
        status: record.status,
        projectId: projectId,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },
  {
    oldTable: "mlm_binary_node",
    newTable: "mlm_binary_node",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const referralId = idMapping[`mlmReferral_${record.referral_id}`];
      const parentId = idMapping[`mlmBinaryNode_${record.parent_id}`];
      const leftChildId = idMapping[`mlmBinaryNode_${record.left_child_id}`];
      const rightChildId = idMapping[`mlmBinaryNode_${record.right_child_id}`];

      if (!referralId || !parentId || !leftChildId || !rightChildId) {
        return null; // Skip if any of the IDs are not found in idMapping
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        referralId: referralId,
        parentId: parentId,
        leftChildId: leftChildId,
        rightChildId: rightChildId,
      };
    },
  },
  {
    oldTable: "mlm_referral",
    newTable: "mlm_referral",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const referrerId = idMapping[`user_${record.referrerUuid}`];
      const referredId = idMapping[`user_${record.referredUuid}`];

      if (!referrerId || !referredId) {
        return null; // Skip if referrerId or referredId is not found in idMapping
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
        status: record.status,
        referrerId: referrerId,
        referredId: referredId,
      };
    },
  },
  {
    oldTable: "mlm_referral_condition",
    newTable: "mlm_referral_condition",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      if (!record.name) {
        return null;
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        name: record.name,
        title: record.title,
        description: record.description,
        type: record.type,
        reward: record.reward,
        rewardType: record.reward_type,
        rewardWalletType: record.reward_wallet_type,
        rewardCurrency: record.reward_currency,
        rewardChain: record.reward_chain,
        status: record.status,
      };
    },
  },
  {
    oldTable: "mlm_referral_reward",
    newTable: "mlm_referral_reward",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const conditionId =
        idMapping[`mlmReferralCondition_${record.condition_id}`];
      const referrerId = idMapping[`user_${record.referrerUuid}`];

      if (!conditionId || !referrerId) {
        return null; // Skip if conditionId or referrerId is not found in idMapping
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        reward: record.reward,
        isClaimed: record.is_claimed,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
        conditionId: conditionId,
        referrerId: referrerId,
      };
    },
  },
  {
    oldTable: "mlm_unilevel_node",
    newTable: "mlm_unilevel_node",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const referralId = idMapping[`mlmReferral_${record.referral_id}`];
      const parentId = idMapping[`mlmUnilevelNode_${record.parent_id}`];

      if (!referralId || !parentId) {
        return null; // Skip if referralId or parentId is not found in idMapping
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        referralId: referralId,
        parentId: parentId,
      };
    },
  },
  {
    oldTable: "staking_duration",
    newTable: "staking_duration",
    hasUuid: false,
    transform: (record, idMapping, tableName) => {
      const poolId = idMapping[`stakingPool_${record.pool_id}`];
      if (!poolId) {
        return null; // Skip if poolId is not found in idMapping
      }

      const newId = uuidv4();
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        poolId: poolId,
        duration: record.duration,
        interestRate: record.interest_rate,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },
  {
    oldTable: "staking_log",
    newTable: "staking_log",
    hasUuid: true,
    transform: (record, idMapping, tableName) => {
      const userId = idMapping[`user_${record.user_id}`];
      const poolId = idMapping[`stakingPool_${record.pool_id}`];

      if (!userId || !poolId || !record.uuid) {
        return null; // Skip if userId or poolId is not found in idMapping or uuid is missing
      }

      const newId = record.uuid;
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        userId: userId,
        poolId: poolId,
        amount: record.amount,
        stakeDate: new Date(record.stake_date),
        releaseDate: new Date(record.release_date),
        status: record.status,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
      };
    },
  },
  {
    oldTable: "staking_pool",
    newTable: "staking_pool",
    hasUuid: true,
    transform: (record, idMapping, tableName) => {
      if (!record.uuid || !record.type) {
        return null;
      }

      const newId = record.uuid;
      idMapping[`${tableName}_${record.id}`] = newId;

      return {
        id: newId,
        name: record.name,
        description: record.description,
        currency: record.currency,
        chain: record.chain,
        type: record.type,
        minStake: record.min_stake,
        maxStake: record.max_stake,
        status: record.status,
        createdAt: record.created_at ? new Date(record.created_at) : new Date(),
        updatedAt: record.updated_at ? new Date(record.updated_at) : new Date(),
        icon: record.icon,
      };
    },
  },
];
