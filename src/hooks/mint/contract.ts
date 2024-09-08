import { createNewContract, getProvider } from "../common";

export const minNft = async (cid: string) => {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const contract = createNewContract(signer);
  const result = await contract.mint(cid);
  return result;
};
