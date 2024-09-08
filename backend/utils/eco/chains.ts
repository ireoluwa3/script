import {
  fetchGeneralEcosystemTransactions,
  fetchPublicEcosystemTransactions,
} from "./transactions";
import { fetchUTXOTransactions } from "./utxo";

type FetchFunction = (address: string) => Promise<any>;

interface ChainConfig {
  name: string;
  decimals: number;
  fetchFunction: FetchFunction;
  cache: boolean;
  networks: Record<string, Network>;
  currency: string;
  smartContract?: SmartContract;
}

interface Network {
  explorer: string;
}

interface SmartContract {
  file: string;
  name: string;
}

export function getTimestampInSeconds() {
  return Math.floor(Date.now() / 1000);
}

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type ChainSymbol =
  | "ETH"
  | "BSC"
  | "POLYGON"
  | "FTM"
  | "OPTIMISM"
  | "TRON"
  | "ARBITRUM"
  | "BASE"
  | "CELO"
  | "RSK";

export const chainConfigs: Record<string, ChainConfig> = {
  ETH: {
    name: "Ethereum",
    decimals: 18,
    fetchFunction: (address: string) =>
      fetchGeneralEcosystemTransactions("ETH", address),
    cache: true,
    networks: {
      mainnet: {
        explorer: "api.etherscan.io",
      },
      sepolia: {
        explorer: "api-sepolia.etherscan.io",
      },
    },
    currency: "ETH",
    smartContract: {
      file: "ERC20",
      name: "ERC20",
    },
  },
  BSC: {
    name: "Binance Smart Chain",
    decimals: 18,
    fetchFunction: (address: string) =>
      fetchGeneralEcosystemTransactions("BSC", address),
    cache: true,
    networks: {
      mainnet: {
        explorer: "api.bscscan.com",
      },
      testnet: {
        explorer: "api-testnet.bscscan.com",
      },
    },
    currency: "BNB",
    smartContract: {
      file: "ERC20",
      name: "BEP20",
    },
  },
  POLYGON: {
    name: "Polygon",
    decimals: 18,
    fetchFunction: (address: string) =>
      fetchGeneralEcosystemTransactions("POLYGON", address),
    cache: true,
    networks: {
      matic: {
        explorer: "api.polygonscan.com",
      },
      "matic-mumbai": {
        explorer: "api-testnet.polygonscan.com",
      },
    },
    currency: "MATIC",
    smartContract: {
      file: "ERC20",
      name: "ERC20",
    },
  },
  FTM: {
    name: "Fantom",
    decimals: 18,
    fetchFunction: (address: string) =>
      fetchGeneralEcosystemTransactions("FTM", address),
    cache: true,
    networks: {
      mainnet: {
        explorer: "api.ftmscan.com",
      },
      testnet: {
        explorer: "api-testnet.ftmscan.com",
      },
    },
    currency: "FTM",
    smartContract: {
      file: "ERC20",
      name: "ERC20",
    },
  },
  OPTIMISM: {
    name: "Optimism",
    decimals: 18,
    fetchFunction: (address: string) =>
      fetchGeneralEcosystemTransactions("OPTIMISM", address),
    cache: true,
    networks: {
      mainnet: {
        explorer: "api-optimistic.etherscan.io",
      },
      goerli: {
        explorer: "api-goerli-optimistic.etherscan.io",
      },
    },
    currency: "ETH",
    smartContract: {
      file: "ERC20",
      name: "ERC20",
    },
  },
  ARBITRUM: {
    name: "Arbitrum",
    decimals: 18,
    fetchFunction: (address: string) =>
      fetchGeneralEcosystemTransactions("ARBITRUM", address),
    cache: true,
    networks: {
      mainnet: {
        explorer: "api.arbiscan.io",
      },
      goerli: {
        explorer: "api-goerli.arbiscan.io",
      },
    },
    currency: "ETH",
    smartContract: {
      file: "ERC20",
      name: "ERC20",
    },
  },
  BASE: {
    name: "Base",
    decimals: 18,
    fetchFunction: (address: string) =>
      fetchGeneralEcosystemTransactions("BASE", address),
    cache: true,
    networks: {
      mainnet: {
        explorer: "api.basescan.org",
      },
      goerli: {
        explorer: "api-goerli.basescan.org",
      },
    },
    currency: "ETH",
    smartContract: {
      file: "ERC20",
      name: "ERC20",
    },
  },
  CELO: {
    name: "Celo",
    decimals: 18,
    fetchFunction: (address: string) =>
      fetchGeneralEcosystemTransactions("CELO", address),
    cache: true,
    networks: {
      mainnet: {
        explorer: "api.celoscan.io",
      },
      alfajores: {
        explorer: "api-alfajores.celoscan.io",
      },
    },
    currency: "CELO",
    smartContract: {
      file: "ERC20",
      name: "ERC20",
    },
  },
  TRON: {
    name: "Tron",
    decimals: 6,
    fetchFunction: (address: string) =>
      fetchPublicEcosystemTransactions(
        `https://api.trongrid.io/v1/accounts/${address}/transactions?only_to=true&only_confirmed=true&limit=50&order_by=block_timestamp,asc`
      ),
    cache: false,
    networks: {
      mainnet: {
        explorer: "api.trongrid.io",
      },
      shasta: {
        explorer: "api.shasta.trongrid.io",
      },
      nile: {
        explorer: "api.nileex.io",
      },
    },
    currency: "TRX",
  },
  RSK: {
    name: "RSK",
    decimals: 18,
    fetchFunction: (address: string) =>
      fetchPublicEcosystemTransactions(
        `https://rootstock.blockscout.com/api/v2/addresses/${address}/transactions?filter=to%20%7C%20from`
      ),
    cache: true,
    networks: {
      mainnet: {
        explorer: "rootstock.blockscout.com/api/v2",
      },
    },
    currency: "RBTC",
  },
  HECO: {
    name: "Huobi ECO Chain",
    decimals: 18,
    fetchFunction: (address: string) =>
      fetchPublicEcosystemTransactions(
        `https://api.hecoinfo.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc`
      ),
    cache: false,
    networks: {
      mainnet: {
        explorer: "api.hecoinfo.com",
      },
    },
    currency: "HT",
    smartContract: {
      file: "ERC20",
      name: "HRC20",
    },
  },
  CRONOS: {
    name: "Cronos",
    decimals: 18,
    fetchFunction: (address: string) =>
      fetchGeneralEcosystemTransactions("CRONOS", address),
    cache: true,
    networks: {
      mainnet: {
        explorer: "api.cronoscan.com",
      },
    },
    currency: "CRON",
    smartContract: {
      file: "ERC20",
      name: "CRC20",
    },
  },
  BTC: {
    name: "Bitcoin",
    decimals: 8,
    fetchFunction: (address: string) => fetchUTXOTransactions("BTC", address),
    cache: true,
    networks: {
      mainnet: {
        explorer: "blockchain.info",
      },
    },
    currency: "BTC",
  },
  LTC: {
    name: "Litecoin",
    decimals: 8,
    fetchFunction: (address: string) => fetchUTXOTransactions("LTC", address),
    cache: true,
    networks: {
      mainnet: {
        explorer: "chain.so",
      },
    },
    currency: "LTC",
  },
  DOGE: {
    name: "Dogecoin",
    decimals: 8,
    fetchFunction: (address: string) => fetchUTXOTransactions("DOGE", address),
    cache: true,
    networks: {
      mainnet: {
        explorer: "chain.so",
      },
    },
    currency: "DOGE",
  },
  DASH: {
    name: "Dash",
    decimals: 8,
    fetchFunction: (address: string) => fetchUTXOTransactions("DASH", address),
    cache: true,
    networks: {
      mainnet: {
        explorer: "chain.so",
      },
    },
    currency: "DASH",
  },
};

// Get chain ID
export const getChainId = async (provider) => {
  return (await provider.getNetwork()).chainId;
};
