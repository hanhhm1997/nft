import { useEffect, useRef, useState } from "react";
import {
  getBaseUrl,
  getListNft,
  getListToken,
} from "../../hooks/profile/contract";
import { IFormInput } from "../mint";
import "./style.css";
import { urlPinata } from "../../constants";
import {
  createAuctionNft,
  isApprovalForAllMarketplace,
  setApprovalForAllMarketplace,
} from "../../hooks/auction/contract";
import ModalMessage, { PopUpRef } from "../../component/modal";
import { useForm } from "react-hook-form";

const Profile = () => {
  const [listNft, setListNft] = useState<IFormInput[]>([]);
  const refModal = useRef<PopUpRef>(null);
  const [tokenId, setTokenId] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ price: string }>();
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
              const listNft = await getListNft(convertListToken, urlPinata);
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

  const createAuction = async (price: string) => {
    const data = await window.ethereum.send("eth_requestAccounts");
    if (data?.result?.[0]) {
      const isApprovalForAll = await isApprovalForAllMarketplace(
        data.result?.[0]
      );
      if (!isApprovalForAll) {
        setApprovalForAllMarketplace();
      }
      if (tokenId || tokenId === 0) {
        await createAuctionNft(tokenId, price);
      }
    }
  };
  const onSubmit = (values: any) => {
    createAuction(values.price);
    refModal?.current?.onCloseModal();
  };
  const onOpenModal = (tokenId: number) => {
    setTokenId(tokenId);
    refModal?.current?.open && refModal.current.open();
  };
  const OneNft = ({ data }: { data: IFormInput }) => {
    return (
      <div className="nft">
        <div className="image-profile">
          <img src={`${urlPinata}/${data?.image}`} alt="nft" />
        </div>
        <h2>{data?.name}</h2>
        <h4>{data?.description}</h4>
        {data?.sortAudio && (
          <audio controls>
            <source src={`${urlPinata}/${data?.sortAudio}`} type="audio/mpeg" />
          </audio>
        )}
        <button
          className="button-submit"
          onClick={() => onOpenModal(data.tokenId)}
        >
          Create Auction
        </button>
      </div>
    );
  };

  const FormAuction = () => {
    return (
      <div>
        <form className="form-mint" onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("price", { required: "Price is required" })}
            type="number"
            className="input-price"
          />
          <button type="submit" className="button-submit">
            Submit
          </button>
        </form>
      </div>
    );
  };

  return (
    <>
      <h2 className="title">Your Minted NFTs</h2>
      <div className="profile-nft">
        {listNft?.map((nft) => {
          return (
            <div key={`nft-${nft?.image}`} className="one-nft">
              <OneNft data={nft} />
            </div>
          );
        })}
      </div>
      <ModalMessage
        title="Create Auction"
        ref={refModal}
        children={
          <>
            <FormAuction />
          </>
        }
      />
    </>
  );
};
export default Profile;
