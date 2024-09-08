import * as assert from "assert";
import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";
import WebSocket from "ws";
import {
  dashNetwork,
  dogecoinNetwork,
  litecoinNetwork,
  satoshiToStandardUnit,
  standardUnitToSatoshi,
} from "./blockchain";
import { models } from "@b/db";
import { decrypt } from "../encrypt";
import { getMasterWalletByChain } from "./wallet";
import { logError } from "@b/utils/logger";

const HTTP_TIMEOUT = 30000;
const BLOCKCYPHER_API_URL = "https://api.blockcypher.com/v1";
const BTC_NETWORK = process.env.BTC_NETWORK || "mainnet";
const BLOCKCYPHER_TOKEN = process.env.BLOCKCYPHER_TOKEN;
const BTC_NODE = process.env.BTC_NODE || "blockcypher";
const LTC_NODE = process.env.LTC_NODE || "blockcypher";
const DOGE_NODE = process.env.DOGE_NODE || "blockcypher";
const DASH_NODE = process.env.DASH_NODE || "blockcypher";
const wsConnections = new Map();

const ECPair = ECPairFactory(ecc);

function getUtxoNetwork(chain) {
  switch (chain) {
    case "BTC":
      return BTC_NETWORK === "mainnet"
        ? bitcoin.networks.bitcoin
        : bitcoin.networks.testnet;
    case "LTC":
      return litecoinNetwork;
    case "DOGE":
      return dogecoinNetwork;
    case "DASH":
      return dashNetwork;
    default:
      throw new Error(`Unsupported UTXO chain: ${chain}`);
  }
}

const getUtxoProvider = (chain) => {
  switch (chain) {
    case "BTC":
      return BTC_NODE;
    case "LTC":
      return LTC_NODE;
    case "DOGE":
      return DOGE_NODE;
    case "DASH":
      return DASH_NODE;
    default:
      return "blockcypher";
  }
};

const providers = {
  haskoin: {
    BTC: `https://api.haskoin.com/btc${
      BTC_NETWORK === "mainnet" ? "" : "test"
    }`,
  },
  blockcypher: {
    BTC: `https://api.blockcypher.com/v1/btc/${
      BTC_NETWORK === "mainnet" ? "main" : "test3"
    }`,
    LTC: "https://api.blockcypher.com/v1/ltc/main",
    DASH: "https://api.blockcypher.com/v1/dash/main",
    DOGE: "https://api.blockcypher.com/v1/doge/main",
  },
};

export const watchAddressBlockCypher = (chain, address, callback) => {
  const network =
    chain === "BTC" ? (BTC_NETWORK === "mainnet" ? "main" : "test3") : "main";
  const ws = new WebSocket(
    `wss://socket.blockcypher.com/v1/${chain.toLowerCase()}/${network}?token=${BLOCKCYPHER_TOKEN}`
  );

  ws.on("open", function open() {
    ws.send(JSON.stringify({ event: "unconfirmed-tx", address: address }));
  });

  ws.on("message", function incoming(data) {
    const messageString = data.toString();
    const message = JSON.parse(messageString);

    if (message && message.hash) {
      callback(message);
      cancelWatchAddress(chain, address); // Close the WebSocket after receiving the transaction
    }
  });

  ws.on("close", function close() {
    console.log(`WebSocket disconnected from ${chain} address: ${address}`);
  });

  ws.on("error", function error(err) {
    logError("watch_address_blockcypher", err, __filename);
  });

  const wsKey = `${chain}_${address.toLowerCase()}`;
  wsConnections.set(wsKey, ws);
};

export const cancelWatchAddress = (chain, address) => {
  const wsKey = `${chain}_${address.toLowerCase()}`;
  const ws = wsConnections.get(wsKey);

  if (ws) {
    try {
      ws.close();
      console.log(
        `WebSocket for ${chain} address ${address} has been successfully closed.`
      );
    } catch (error) {
      logError("cancel_watch_address", error, __filename);
    } finally {
      wsConnections.delete(wsKey);
    }
  } else {
    console.log(`No active WebSocket found for ${chain} address ${address}.`);
  }
};

export async function createTransactionDetailsForUTXO(
  id,
  transaction,
  address,
  chain
) {
  const txHash = transaction.hash;

  const inputs = transaction.inputs.map((input) => ({
    prevHash: input.prev_hash,
    outputIndex: input.output_index,
    value: satoshiToStandardUnit(input.output_value, chain),
    addresses: input.addresses,
    script: input.script,
  }));

  const outputs = transaction.outputs
    .filter((output) => output.addresses.includes(address))
    .map((output) => ({
      value: satoshiToStandardUnit(output.value, chain),
      addresses: output.addresses,
      script: output.script,
    }));

  const amount = outputs.reduce((acc, output) => acc + output.value, 0);

  const txDetails = {
    id,
    address,
    chain,
    hash: txHash,
    from: inputs.map((input) => input.addresses).flat(),
    to: outputs.map((output) => output.addresses).flat(),
    amount,
    inputs,
    outputs,
  };

  return txDetails;
}

export async function recordUTXO(
  walletId,
  transactionId,
  index,
  amount,
  script,
  status
) {
  await models.ecosystemUtxo.create({
    walletId: walletId,
    transactionId: transactionId,
    index: index,
    amount: amount,
    script: script,
    status: status,
  });
}

const constructApiUrl = (
  chain,
  operation,
  address = "",
  txHash = "",
  provider = ""
) => {
  if (provider === "") provider = getUtxoProvider(chain);

  switch (provider) {
    case "haskoin": {
      const haskoinBaseURL = providers.haskoin[chain];
      switch (operation) {
        case "fetchBalance":
          return `${haskoinBaseURL}/address/${address}/balance`;
        case "fetchTransactions":
          return `${haskoinBaseURL}/address/${address}/transactions/full`;
        case "fetchTransaction":
          return `${haskoinBaseURL}/transaction/${txHash}`;
        case "fetchRawTransaction":
          return `${haskoinBaseURL}/transaction/${txHash}/raw`;
        case "broadcastTransaction":
          return `${haskoinBaseURL}/transactions/full`;
        default:
          throw new Error(`Unsupported operation for Haskoin: ${operation}`);
      }
    }
    case "blockcypher":
    default: {
      const blockcypherBaseURL = providers.blockcypher[chain];
      switch (operation) {
        case "fetchBalance":
          return `${blockcypherBaseURL}/addrs/${address}/balance`;
        case "fetchTransactions":
          return `${blockcypherBaseURL}/addrs/${address}`;
        case "fetchTransaction":
          return `${blockcypherBaseURL}/txs/${txHash}`;
        case "fetchRawTransaction":
          return `${blockcypherBaseURL}/txs/${txHash}?includeHex=true`;
        case "broadcastTransaction":
          return `${blockcypherBaseURL}/txs/push`;
        default:
          throw new Error(
            `Unsupported operation for BlockCypher: ${operation}`
          );
      }
    }
  }
};

const fetchFromApi = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response structure");
    }
    return data;
  } catch (error) {
    logError("fetch_from_api", error, __filename);
    throw error;
  }
};

export const createUTXOWallet = (chain) => {
  const network = getUtxoNetwork(chain);
  if (!network) {
    throw new Error(`Unsupported UTXO chain: ${chain}`);
  }

  const keyPair = ECPair.makeRandom({ network });
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network,
  });

  if (chain === "BTC" && network === bitcoin.networks.testnet) {
    assert.strictEqual(
      address!.startsWith("m") || address!.startsWith("n"),
      true
    );
  }

  const privateKey = keyPair.toWIF();

  return {
    address,
    data: {
      privateKey,
    },
  };
};

export const fetchUTXOTransactions = async (chain, address) => {
  const url = constructApiUrl(chain, "fetchTransactions", address, "");
  const data: any = await fetchFromApi(url, { timeout: HTTP_TIMEOUT });

  const provider = getUtxoProvider(chain);
  switch (provider) {
    case "haskoin":
      return data.map((tx) => ({
        hash: tx.txid,
        blockHeight: tx.block?.height,
        value: tx.outputs.reduce((sum, output) => sum + output.value, 0),
        confirmedTime: new Date(tx.time * 1000).toISOString(),
        spent: tx.outputs.some((output) => output.spent),
        confirmations: tx.block ? -tx.block.height : 0,
        inputs: tx.inputs,
        outputs: tx.outputs.map((output) => ({
          address: output.addresses,
          value: output.value,
          spent: output.spent,
          spender: output.spender ? output.spender.txid : null,
        })),
      }));

    case "blockcypher":
    default:
      if (!Array.isArray(data.txrefs)) {
        return [];
      }
      return data.txrefs.map((tx) => ({
        hash: tx.tx_hash,
        blockHeight: tx.block_height,
        value: tx.value,
        confirmedTime: tx.confirmed,
        spent: tx.spent,
        confirmations: tx.confirmations,
      }));
  }
};

export const fetchUTXOWalletBalance = async (chain, address) => {
  const url = constructApiUrl(chain, "fetchBalance", address, "");
  const data: any = await fetchFromApi(url);
  if (data.error) {
    logError("fetch_utxo_wallet_balance", new Error(data.error), __filename);
    return 0;
  }

  const provider = getUtxoProvider(chain);
  let balance;
  switch (provider) {
    case "haskoin":
      balance = Number(data.confirmed) + Number(data.unconfirmed);
      return parseFloat(balance) > 0
        ? satoshiToStandardUnit(balance, chain)
        : 0;
    case "blockcypher":
    default:
      balance = Number(data.final_balance);
      return parseFloat(balance) > 0
        ? satoshiToStandardUnit(balance, chain)
        : 0;
  }
};

export const fetchRawUtxoTransaction = async (txHash, chain) => {
  const provider = getUtxoProvider(chain);
  const apiURL = constructApiUrl(chain, "fetchRawTransaction", "", txHash);

  try {
    const data: any = await fetchFromApi(apiURL, { timeout: HTTP_TIMEOUT });
    switch (provider) {
      case "haskoin":
        if (!data.result) {
          throw new Error("Missing hex data in response");
        }
        return data.result;

      case "blockcypher":
      default:
        if (!data.hex) {
          throw new Error("Missing hex data in response");
        }
        return data.hex;
    }
  } catch (error) {
    logError("fetch_raw_utxo_transaction", error, __filename);
    throw error;
  }
};

export const fetchUtxoTransaction = async (txHash, chain) => {
  const provider = getUtxoProvider(chain);
  const apiURL = constructApiUrl(chain, "fetchTransaction", "", txHash);

  const maxRetries = 10; // Maximum number of retries
  const retryDelay = 30000; // 30 seconds delay between retries

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const data: any = await fetchFromApi(apiURL, { timeout: HTTP_TIMEOUT });

      if (data.error && provider === "haskoin") {
        if (data.error === "not-found-or-invalid-arg" && attempt < maxRetries) {
          console.log(
            `Attempt ${attempt}: Transaction not found, retrying in ${
              retryDelay / 1000
            } seconds...`
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue; // Retry
        }
        throw new Error(data.message); // Throw error for other cases
      }

      return formatTransactionData(data, provider);
    } catch (error) {
      logError("fetch_utxo_transaction", error, __filename);
      if (attempt === maxRetries) throw error; // Throw error after final attempt
    }
  }
};

function formatTransactionData(data, provider) {
  switch (provider) {
    case "haskoin":
      return {
        hash: data.txid,
        block_height: data.block?.height,
        inputs: data.inputs,
        outputs: data.outputs.map((output) => ({
          addresses: [output.addresses],
          script: output.pkscript,
          value: output.value,
          spent: output.spent,
          spender: output.spender,
        })),
      };

    case "blockcypher":
    default:
      return {
        hash: data.hash,
        block_height: data.block_height,
        inputs: data.inputs,
        outputs: data.outputs.map((output) => ({
          addresses: output.addresses,
          script: output.script,
          value: output.value,
          spender: output.spent_by,
        })),
      };
  }
}

export const verifyUTXOTransaction = async (chain, txHash) => {
  const url = constructApiUrl(chain, "fetchTransaction", "", txHash);

  const startTime = Date.now();
  const maxDuration = 1800 * 1000; // 30 minutes in milliseconds
  const retryInterval = 30 * 1000; // 30 seconds in milliseconds
  const provider = getUtxoProvider(chain);

  while (Date.now() - startTime < maxDuration) {
    try {
      const txData: any = await fetchFromApi(url);
      let confirmed: boolean = false;
      let fee: number = 0;

      switch (provider) {
        case "haskoin":
          confirmed = !!txData.block;
          fee = txData.fee;
          break;
        case "blockcypher":
        default:
          confirmed = txData.confirmations >= 1;
          fee = txData.fee ? satoshiToStandardUnit(txData.fee, chain) : 0;
          break;
      }

      if (confirmed) {
        return { confirmed, fee };
      }
    } catch (error) {
      logError("verify_utxo_transaction", error, __filename);
    }
    await new Promise((resolve) => setTimeout(resolve, retryInterval));
  }

  return { confirmed: false, fee: 0 };
};

export const broadcastRawUtxoTransaction = async (rawTxHex, chain) => {
  if (!rawTxHex) {
    console.error(
      "Error broadcasting transaction: No transaction data provided"
    );
    return {
      success: false,
      error: "No transaction data provided",
      txid: null,
    };
  }

  try {
    const apiUrl = constructApiUrl(
      chain,
      "broadcastTransaction",
      "",
      "",
      "blockcypher"
    );

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tx: rawTxHex }),
    });

    const data: any = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Transaction broadcast failed");
    }

    if (!data.tx) {
      throw new Error(
        "Transaction broadcast failed: No transaction ID returned"
      );
    }

    return { success: true, txid: data.tx.hash };
  } catch (error) {
    logError("broadcast_raw_utxo_transaction", error, __filename);
    return { success: false, error: error.message, txid: null };
  }
};

export const calculateUTXOFee = async (toAddress, amount, chain) => {
  const feeRatePerByte = await getCurrentUtxoFeeRatePerByte(chain);
  if (!feeRatePerByte) {
    throw new Error("Failed to fetch current fee rate");
  }

  const inputs: { transactionId: string; index: number; amount: number }[] = [];
  const outputs: { toAddress: string; amount: number }[] = [];
  let totalInputValue = 0;

  const utxos = await models.ecosystemUtxo.findAll({
    where: { status: false },
    order: [["amount", "DESC"]],
  });
  if (utxos.length === 0) throw new Error("No UTXOs available for withdrawal");

  for (const utxo of utxos) {
    inputs.push(utxo);
    totalInputValue += utxo.amount;
    if (totalInputValue >= amount) {
      break;
    }
  }

  outputs.push({ toAddress, amount });

  const estimatedTxSize = inputs.length * 180 + outputs.length * 34 + 10;
  const transactionFee = estimatedTxSize * feeRatePerByte;

  return transactionFee;
};

export async function getCurrentUtxoFeeRatePerByte(chain) {
  let url;
  switch (chain) {
    case "BTC":
      url = "https://mempool.space/api/v1/fee/recommended";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            `Error fetching fee rate for ${chain}: ${response.statusText}`
          );
        }

        const data: any = await response.json();
        const feeRatePerByte = data.halfHourFee;

        return feeRatePerByte;
      } catch (error) {
        logError("get_current_utxo_fee_rate_per_byte", error, __filename);
        return null;
      }
    case "LTC":
      url = `${BLOCKCYPHER_API_URL}/ltc/main`;
      break;
    case "DOGE":
      url = `${BLOCKCYPHER_API_URL}/doge/main`;
      break;
    default:
      throw new Error(`Unsupported UTXO chain: ${chain}`);
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Error fetching fee rate for ${chain}: ${response.statusText}`
      );
    }

    const data: any = await response.json();
    const mediumFeePerKb = data.medium_fee_per_kb || data.medium_fee_per_kbyte;
    const feeRatePerByte = mediumFeePerKb / 1024;

    return feeRatePerByte;
  } catch (error) {
    logError("get_current_utxo_fee_rate_per_byte", error, __filename);
    return null;
  }
}

export async function handleUTXOWithdrawal(transaction: Transaction) {
  const metadata =
    typeof transaction.metadata === "string"
      ? JSON.parse(transaction.metadata)
      : transaction.metadata;
  const chain = metadata.chain;
  const toAddress = metadata.toAddress;
  const amountToSend = standardUnitToSatoshi(transaction.amount, chain);
  const flatFee = standardUnitToSatoshi(transaction.fee, chain);

  const wallet = await models.wallet.findByPk(transaction.walletId);
  if (!wallet) throw new Error("Wallet not found");

  const masterWallet = (await getMasterWalletByChain(
    chain
  )) as unknown as EcosystemMasterWallet;
  if (!masterWallet) throw new Error(`Master wallet not found for ${chain}`);

  const utxos = await models.ecosystemUtxo.findAll({
    where: { status: false },
    order: [["amount", "DESC"]],
  });
  if (utxos.length === 0) throw new Error("No UTXOs available for withdrawal");

  const network = getUtxoNetwork(chain);
  if (!network) throw new Error(`Unsupported UTXO chain: ${chain}`);

  const psbt = new bitcoin.Psbt({ network });
  let totalInputValue = 0;
  const keyPairs: { index: number; keyPair: any }[] = [];

  let transactionFee;
  if (chain === "BTC") {
    transactionFee = 380;
  } else {
    const currentFeeRatePerByte = await getCurrentUtxoFeeRatePerByte(chain);

    if (!currentFeeRatePerByte) {
      throw new Error("Failed to fetch current fee rate");
    }

    const estimatedTxSize = keyPairs.length * 180 + 2 * 34 + 10;
    transactionFee = estimatedTxSize * currentFeeRatePerByte;
  }

  const requiredAmount = amountToSend + flatFee + transactionFee;

  for (const utxo of utxos) {
    if (totalInputValue >= requiredAmount) break;

    const walletData = (await models.walletData.findOne({
      where: { walletId: utxo.walletId },
    })) as unknown as WalletData;
    if (!walletData) continue;

    const decryptedData = JSON.parse(decrypt(walletData.data));
    if (!decryptedData.privateKey) continue;

    const rawTxHex = await fetchRawUtxoTransaction(utxo.transactionId, chain);
    psbt.addInput({
      hash: utxo.transactionId,
      index: utxo.index,
      nonWitnessUtxo: Buffer.from(rawTxHex, "hex"),
    });
    totalInputValue += utxo.amount;

    const keyPair = ECPair.fromWIF(decryptedData.privateKey, network);
    keyPairs.push({ index: psbt.inputCount - 1, keyPair });
  }

  if (totalInputValue < requiredAmount) {
    throw new Error(
      "Insufficient funds to cover the amount and transaction fee"
    );
  }

  const walletAddresses =
    typeof wallet.address === "string"
      ? JSON.parse(wallet.address)
      : (wallet.address as unknown as Record<string, { address: string }>);

  if (!walletAddresses) throw new Error("Wallet addresses not found");
  if (!walletAddresses?.[chain])
    throw new Error("Wallet address chain not found");
  if (!walletAddresses?.[chain]?.address)
    throw new Error("Wallet address not found");

  const changeAddress = walletAddresses?.[chain]?.address;
  const change = totalInputValue - requiredAmount;

  // Add the output for the toAddress (the recipient)
  psbt.addOutput({
    address: toAddress,
    value: amountToSend,
  });

  // Add the output for the change address, if there's any change left
  if (change > 0) {
    psbt.addOutput({
      address: changeAddress,
      value: change,
    });
  }

  keyPairs.forEach(({ index, keyPair }) => {
    psbt.signInput(index, keyPair);
  });

  psbt.finalizeAllInputs();

  const rawTx = psbt.extractTransaction().toHex();
  const broadcastResult = await broadcastRawUtxoTransaction(rawTx, chain);
  if (!broadcastResult.success)
    throw new Error("Failed to broadcast transaction");

  const txid = broadcastResult.txid;

  if (change > 0) {
    const changeTxData: any = await fetchUtxoTransaction(txid, chain);

    const changeOutput = changeTxData.outputs.find(
      (output) => output.addresses && output.addresses.includes(changeAddress)
    );

    if (changeOutput) {
      const changeOutputIndex = changeTxData.outputs.indexOf(changeOutput);
      const changeScript = changeOutput.script;

      await models.ecosystemUtxo.create({
        walletId: wallet.id,
        transactionId: txid,
        index: changeOutputIndex,
        amount: change,
        script: changeScript,
        status: false,
      });
    } else {
      console.error("Change output not found in transaction data");
    }
  }

  for (const utxo of utxos) {
    await models.ecosystemUtxo.update(
      { status: true },
      {
        where: { id: utxo.id },
      }
    );
  }

  await models.transaction.update(
    {
      status: "COMPLETED",
      description: `Withdrawal of ${transaction.amount} ${wallet.currency} to ${toAddress}`,
      referenceId: txid,
    },
    {
      where: { id: transaction.id },
    }
  );

  return { success: true, txid: txid };
}
