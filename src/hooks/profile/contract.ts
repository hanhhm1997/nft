import axios from "axios";
import { createContract } from "../common";

export const getListToken = async (address: string) => {
  const contract = await createContract();
  const result = await contract.listTokenIds(address);
  return result;
};

export const getCid = async (tokenId: number) => {
  const contract = await createContract();
  const result = await contract.cid(tokenId);
  return result;
};

export const getListNft = async (tokenIds: number[]) => {
  const contract = await createContract();
  const listNftPromises = tokenIds?.map(async (token) => {
    try {
      const cid = await contract.getCid(token);
      if (cid) {
        const responseJson = await axios.get(
          `https://lavender-charming-chickadee-619.mypinata.cloud/ipfs/${cid}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return responseJson?.data;
      }
    } catch (error) {
      console.log("error", error);
      return undefined;
    }
  });
  const listNft = await Promise.all(listNftPromises);
  return listNft;
};
