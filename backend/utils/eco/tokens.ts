import { ContractFactory, ethers } from "ethers";
import { chainConfigs } from "./chains";
import { RedisSingleton } from "../redis";
import { getAdjustedGasPrice } from "./gas";
import { getSmartContract } from "./smartContract";
import { decrypt } from "../encrypt";
import { getProvider } from "./provider";
import { models } from "@b/db";
import { ecosystemTokenAttributes } from "@db/ecosystemToken";
import { ecosystemMasterWalletAttributes } from "@db/ecosystemMasterWallet";
import { logError } from "@b/utils/logger";

const CACHE_EXPIRATION = 300; // Cache for 5 minutes

export async function getTokenContractAddress(
  chain: string,
  currency: string
): Promise<any> {
  try {
    const token = await getEcosystemToken(chain, currency);
    if (!token) {
      throw new Error("Token not found");
    }

    const contractAddress = token.contract;

    if (!ethers.isAddress(contractAddress)) {
      throw new Error(`Invalid token contract address: ${contractAddress}`);
    }

    return {
      contractAddress,
      contractType: token.contractType,
      tokenDecimals: token.decimals,
    };
  } catch (error) {
    logError("get_token_contract_address", error, __filename);
    console.error("Failed to get token contract: " + error.message);
    throw new Error("Withdrawal failed - please try again later");
  }
}

export const fetchTokenHolders = async (
  chain: string,
  network: string,
  contract: string
) => {
  try {
    const chainConfig = chainConfigs[chain];
    if (!chainConfig) {
      throw new Error(`Unsupported chain: ${chain}`);
    }

    const apiKey = process.env[`${chain}_EXPLORER_API_KEY`];
    if (!apiKey) {
      throw new Error(`API Key for ${chain} is not set`);
    }

    const networkConfig = chainConfig.networks[network];
    if (!networkConfig || !networkConfig.explorer) {
      throw new Error(`Unsupported network: ${network} for chain: ${chain}`);
    }

    const cacheKey = `token:${contract}:holders`;
    const cachedData = await getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const apiUrl = `https://${networkConfig.explorer}/api?module=account&action=tokentx&contractaddress=${contract}&page=1&offset=100&sort=asc&apikey=${apiKey}`;

    let data;
    try {
      const response = await fetch(apiUrl);
      data = await response.json();
    } catch (error) {
      logError("fetch_token_holders", error, __filename);
      throw new Error(`API call failed: ${error.message}`);
    }

    if (data.status !== "1") {
      throw new Error(`API Error: ${data.message}`);
    }

    const holders: Record<string, number> = {};
    for (const tx of data.result) {
      const { from, to, value } = tx;
      holders[from] = (holders[from] || 0) - parseFloat(value);
      holders[to] = (holders[to] || 0) + parseFloat(value);
    }

    const decimals = chainConfig.decimals || 18;

    const formattedHolders = Object.entries(holders)
      .map(([address, balance]) => {
        return {
          address,
          balance: parseFloat((balance / Math.pow(10, decimals)).toFixed(8)),
        };
      })
      .filter((holder) => holder.balance > 0);

    const redis = RedisSingleton.getInstance();
    await redis.setex(
      cacheKey,
      CACHE_EXPIRATION,
      JSON.stringify(formattedHolders)
    );

    return formattedHolders;
  } catch (error) {
    logError("fetch_token_holders", error, __filename);
    console.error("Failed to fetch token holders: " + error.message);
    throw new Error("Failed to fetch token holders");
  }
};

const getCachedData = async (cacheKey: string) => {
  const redis = RedisSingleton.getInstance();
  const cachedData: string | null = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  return null;
};

export async function deployTokenContract(
  masterWallet: ecosystemMasterWalletAttributes,
  chain: string,
  name: string,
  symbol: string,
  receiver: string,
  decimals: number,
  initialBalance: number,
  cap: number
): Promise<string | undefined> {
  try {
    // Initialize Ethereum provider
    const provider = await getProvider(chain);
    if (!provider) {
      throw new Error("Provider not initialized");
    }

    // Decrypt mnemonic
    if (!masterWallet.data) {
      throw new Error("Master wallet data not found");
    }
    const decryptedData = JSON.parse(decrypt(masterWallet.data));
    if (!decryptedData || !decryptedData.privateKey) {
      throw new Error("Decrypted data or Mnemonic not found");
    }
    const { privateKey } = decryptedData;

    // Create a signer
    const signer = new ethers.Wallet(privateKey).connect(provider);

    // Get contract ABI and Bytecode
    const smartContractFile = chainConfigs[chain]?.smartContract?.file;
    if (!smartContractFile) {
      throw new Error(`Smart contract file not found for chain ${chain}`);
    }
    const { abi, bytecode } = await getSmartContract(
      "token",
      smartContractFile
    );
    if (!abi || !bytecode) {
      throw new Error("Smart contract ABI or Bytecode not found");
    }

    // Create Contract Factory
    const tokenFactory = new ContractFactory(abi, bytecode, signer);

    if (initialBalance === undefined || cap === undefined) {
      throw new Error("Initial balance or Cap is undefined");
    }

    // Convert initialBalance to its smallest unit based on the number of decimals
    const adjustedInitialBalance = ethers.parseUnits(
      initialBalance.toString(),
      decimals
    );
    const adjustedCap = ethers.parseUnits(cap.toString(), decimals);

    // Fetch adjusted gas price
    const gasPrice = await getAdjustedGasPrice(provider);

    // Deploy the contract with dynamic gas settings
    const tokenContract = await tokenFactory.deploy(
      name,
      symbol,
      receiver,
      decimals,
      adjustedCap,
      adjustedInitialBalance,
      {
        gasPrice: gasPrice,
      }
    );

    // Wait for the contract to be deployed
    const response = await tokenContract.waitForDeployment();

    return await response.getAddress();
  } catch (error: any) {
    logError("deploy_token_contract", error, __filename);
    throw new Error(error.message);
  }
}

export async function getEcosystemToken(
  chain: string,
  currency: string
): Promise<ecosystemTokenAttributes> {
  const network = process.env[`${chain}_NETWORK`]; // Ensuring the network is dynamically fetched based on the chain

  const token = await models.ecosystemToken.findOne({
    where: {
      chain: chain,
      currency: currency,
      network: network,
    },
  });

  if (!token) {
    throw new Error(
      `Token not found for chain: ${chain} and currency: ${currency}`
    );
  }

  return token;
}
