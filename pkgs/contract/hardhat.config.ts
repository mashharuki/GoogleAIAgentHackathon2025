import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";
import type { HardhatUserConfig } from "hardhat/config";
import fs from "node:fs";
import path from "node:path";

dotenv.config();

const { PRIVATE_KEY,ARBITRUM_ETHERSCAN_KEY, BASESCAN_API_KEY } = process.env;

// タスクファイルを読み込むための設定
const SKIP_LOAD = process.env.SKIP_LOAD === "true";
if (!SKIP_LOAD) {
  const taskPaths = ["", "utils", "lock"];
  taskPaths.forEach((folder) => {
    const tasksPath = path.join(__dirname, "tasks", folder);
    fs.readdirSync(tasksPath)
      .filter((_path) => _path.includes(".ts"))
      .forEach((task) => {
        require(`${tasksPath}/${task}`);
      });
  });
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.27",
        settings: {
          viaIR: true,
        },
      },
    ],
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    },
    flowTestnet: {
      url: "https://testnet.evm.nodes.onflow.org",
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    },
    arbitrumSepolia: {
      url: 'https://sepolia-rollup.arbitrum.io/rpc',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    },
    baseSepolia: {
      url: 'https://sepolia.base.org',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      chiado: "empty",
      minato: "empty",
      flowTestnet: "empty",
      arbitrumSepolia: ARBITRUM_ETHERSCAN_KEY!,
      baseSepolia: BASESCAN_API_KEY!
    },
    customChains: [
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          apiURL: "https://gnosis-chiado.blockscout.com/api",
          browserURL: "https://gnosis-chiado.blockscout.com",
        },
      },
      {
        network: "flowTestnet",
        chainId: 545,
        urls: {
          apiURL: "https://evm-testnet.flowscan.io/api",
          browserURL: "https://evm-testnet.flowscan.io/",
        },
      },
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        },
      },
      {
        network: "baseSepolia",
        chainId: 84532,
        urls: {
         apiURL: "https://api-sepolia.basescan.org/api",
         browserURL: "https://sepolia.basescan.org"
        }
      }
    ],
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
