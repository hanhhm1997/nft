import { useEffect, useState } from "react";
import {
  getInfoAuctionAuctioneer,
  listAuctionNft,
} from "../../hooks/auction/contract";
import { addressMaketplace, urlPinata } from "../../constants";
import { getListNft } from "../../hooks/profile/contract";
import { IFormInput } from "../mint";
import { OneNft } from "./OneNft";

export const Auction = () => {
  const [listNft, setListNft] = useState<IFormInput[]>([]);
  const [address, setAddress] = useState<null | string>(null);
  const [auctioneer, setAuctioneer] = useState<null | string>(null);

  useEffect(() => {
    const fetch = async () => {
      if (window.ethereum) {
        try {
          const listToken = await listAuctionNft();
          const data = await window.ethereum.send("eth_requestAccounts");
          if (data?.result?.[0]) {
            setAddress(data?.result?.[0]);
          }

          const convertListToken =
            listToken && Array.from(listToken).map((num) => Number(num));
          if (convertListToken?.length > 0) {
            const listNft = await getListNft(convertListToken, urlPinata);
            setListNft(listNft);
          }
        } catch (error) {
          console.log("error");
        }
      }
    };
    fetch();
  }, []);

  return (
    <>
      <h2 className="title">Auction</h2>
      <div className="profile-nft">
        {listNft?.map((nft) => {
          return (
            <div key={`nft-${nft?.image}`} className="one-nft">
              <OneNft data={nft} addressUser={address} />
            </div>
          );
        })}
      </div>
    </>
  );
};
