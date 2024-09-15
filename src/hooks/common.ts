import { ethers } from "ethers";
import { abiNft, marketplaceNft } from "./abi/abi";
import { addressMaketplace, addressNft } from "../constants";
import axios from "axios";

export const getProvider = async () => {
  const profile = new ethers.BrowserProvider(window.ethereum);
  return profile;
};
export const createNewContract = (signerOrProvider: any) => {
  return new ethers.Contract(addressNft, abiNft, signerOrProvider);
};
export const createNewContractMarketplace = (signerOrProvider: any) => {
  return new ethers.Contract(
    addressMaketplace,
    marketplaceNft,
    signerOrProvider
  );
};

export const createContract = async () => {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const contract = createNewContract(signer);
  return contract;
};

export const switchNetwork = async () => {
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: ethers.toQuantity(1001) }],
  });
};

export const checkEndAddNetWork = async () => {
  try {
    await switchNetwork();
  } catch (error: any) {
    console.log("error", error, error.code);
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: ethers.toQuantity(1001),
              chainName: "Klaytn Baobab",
              rpcUrls: ["https://public-en-baobab.klaytn.net"],
              nativeCurrency: {
                name: "KLAY",
                symbol: "KLAY",
                decimals: 18,
              },
              blockExplorerUrls: ["https://baobab.klaytnscope.com"],
            },
          ],
        });
        switchNetwork();
      } catch (addError) {}
    }
  }
};

export const uploadFilePinata = async (name: string, value: string) => {
  const formData = new FormData();
  formData.append("file", value);
  const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    formData,
    {
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: "f25b2e69826b1a9a1422",
        pinata_secret_api_key:
          "f8fee89c0250e0c40abb97bc704de4ff58f3631620f201c7a0f8f7cafd1ef385",
      },
    }
  );
  return response?.data?.IpfsHash;
};
