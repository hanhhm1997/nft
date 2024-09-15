import { ethers } from "ethers";
import {
  createNewContract,
  createNewContractMarketplace,
  getProvider,
} from "../common";
import { addressMaketplace, decimals } from "../../constants";

export const createAuctionNft = async (
  tokenId: number,
  price: string,
  time?: number
) => {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const contract = createNewContractMarketplace(signer);
  const weiAmount = ethers.parseUnits(price, decimals);
  console.log("tokenId", tokenId, price, time);
  const result = await contract.createAuction(tokenId, weiAmount, 10);
  return result;
};

export const listAuctionNft = async () => {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const contract = createNewContractMarketplace(signer);
  const result = await contract.listAuction();
  return result;
};

export const getAuctionTime = async (tokenId: number) => {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const contract = createNewContractMarketplace(signer);
  const result = await contract.getInfoAuctionTime(tokenId);
  return result;
};

export const getInfoAuctionAuctioneer = async (tokenId: number) => {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const contract = createNewContractMarketplace(signer);
  const result = await contract.getInfoAuctionAuctioneer(tokenId);
  return result;
};
export const getInfoAuctionHighestBid = async (tokenId: number) => {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const contract = createNewContractMarketplace(signer);
  const result = await contract.getInfoAuctionHighestBid(tokenId);
  return result;
};

export const auctionBidNft = async (tokenId: number, price: string) => {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const contract = createNewContractMarketplace(signer);
  const weiAmount = ethers.parseUnits(price, decimals);

  const result = await contract.bid(tokenId, { value: weiAmount });
  return result;
};

export const auctionCancelNft = async (tokenId: number) => {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const contract = createNewContractMarketplace(signer);
  const result = await contract.cancelAuction(tokenId);
  return result;
};

export const auctionFinishNft = async (tokenId: number) => {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const contract = createNewContractMarketplace(signer);
  const result = await contract.finishAuction(tokenId);
  return result;
};

export const setApprovalForAllMarketplace = async () => {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const contract = createNewContract(signer);
  const result = await contract.setApprovalForAll(addressMaketplace, true);
  return result;
};

export const isApprovalForAllMarketplace = async (owner: string) => {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const contract = createNewContract(signer);
  const result = await contract.isApprovedForAll(owner, addressMaketplace);
  return result;
};
