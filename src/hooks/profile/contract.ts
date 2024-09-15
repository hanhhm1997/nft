import axios from "axios";
import { createContract } from "../common";
import { urlPinata } from "../../constants";

export const getListToken = async (address: string) => {
  const contract = await createContract();
  const result = await contract.listTokenIds(address);
  return result;
};

export const getTokenUri = async (tokenId: number) => {
  const contract = await createContract();
  const result = await contract.tokenURI(tokenId);
  return result;
};

export const getBaseUrl = async () => {
  const contract = await createContract();
  const result = await contract.baseURI();
  return result;
};

export const getListNft = async (tokenIds: number[], url: string) => {
  const contract = await createContract();
  const listNftPromises = tokenIds?.map(async (token) => {
    try {
      const tokeUri = await contract.tokenURI(token);
      if (tokeUri) {
        const responseJson = await axios.get(`${urlPinata}/${tokeUri}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return { ...responseJson?.data, tokenId: token };
      }
    } catch (error) {
      console.log("error", error);
      return undefined;
    }
  });
  const listNft = await Promise.all(listNftPromises);
  return listNft;
};
