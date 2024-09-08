import { useEffect, useState } from "react";
import { getListNft, getListToken } from "../../hooks/profile/contract";
import { IFormInput } from "../mint";
import "./style.css";
import { urlPinata } from "../../constants";

const Profile = () => {
  const [listNft, setListNft] = useState<IFormInput[]>([]);
  useEffect(() => {
    const fetch = async () => {
      if (window.ethereum) {
        try {
          const data = await window.ethereum.send("eth_requestAccounts");
          if (data?.result?.[0]) {
            const listToken = await getListToken(data?.result?.[0]);
            const convertListToken =
              listToken && Array.from(listToken).map((num) => Number(num));

            if (convertListToken?.length > 0) {
              const listNft = await getListNft(convertListToken);
              setListNft(listNft);
            }
          }
        } catch (error) {
          console.log("error");
        }
      }
    };
    fetch();
  }, []);
  const OneNft = ({ data }: { data: IFormInput }) => {
    return (
      <div className="nft">
        <div className="image-profile">
          <img src={`${urlPinata}/${data.image}`} alt="nft" />
        </div>
        <h2>{data?.name}</h2>
        <h4>{data?.description}</h4>
      </div>
    );
  };

  return (
    <>
      <h2 className="title">Your Minted NFTs</h2>
      <div className="profile-nft">
        {listNft?.map((nft) => {
          return (
            <div key={`nft-${nft.image}`} className="one-nft">
              <OneNft data={nft} />
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Profile;
