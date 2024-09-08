import { ethers } from "ethers";
import { abiNft } from "./abi/abi";
import { addressNft } from "../constants";

export const getProvider = async () => {
  const profile = new ethers.BrowserProvider(window.ethereum);
  return profile;
};
export const createNewContract = (signerOrProvider: any) => {
  return new ethers.Contract(addressNft, abiNft, signerOrProvider);
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
