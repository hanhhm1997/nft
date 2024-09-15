import { useEffect, useRef, useState } from "react";
import { urlPinata } from "../../constants";
import {
  auctionBidNft,
  auctionCancelNft,
  auctionFinishNft,
  getInfoAuctionAuctioneer,
} from "../../hooks/auction/contract";
import { IFormInput } from "../mint";
import "./style.css";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import ModalMessage, { PopUpRef } from "../../component/modal";

interface Props {
  data: IFormInput;
  addressUser: string | null;
}

export const OneNft = ({ data, addressUser }: Props) => {
  const [auctioneer, setAuctioneer] = useState<string | null>(null);
  const refModal = useRef<PopUpRef>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ price: string }>();

  useEffect(() => {
    const fetch = async () => {
      if (window.ethereum) {
        try {
          const auctioneer = await getInfoAuctionAuctioneer(data.tokenId);
          if (auctioneer) {
            setAuctioneer(auctioneer);
          }
        } catch (error) {
          console.log("error");
        }
      }
    };
    fetch();
  }, []);
  const onCancelAuction = async () => {
    try {
      const result = await auctionCancelNft(data.tokenId);
      toast.success("Cancel is successful");

      return result;
    } catch (error: any) {
      toast.error(error?.reason);
    }
  };
  const onFinishAuction = async () => {
    try {
      const result = await auctionFinishNft(data.tokenId);
      toast.success("Finish is successful");

      return result;
    } catch (error: any) {
      toast.error(error?.reason);
    }
  };
  const onBidAuction = async (price: string) => {
    try {
      const result = await auctionBidNft(data.tokenId, price);
      toast.success("Finish is successful");

      return result;
    } catch (error: any) {
      console.log("error", error);
      toast.error(error?.reason);
    }
  };
  const onSubmit = (values: { price: string }) => {
    onBidAuction(values.price);
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
  if (auctioneer) {
    return (
      <>
        <div className="nft">
          <div className="image-profile">
            <img src={`${urlPinata}/${data?.image}`} alt="nft" />
          </div>
          <h2>{data?.name}</h2>
          <h4>{data?.description}</h4>
          {data?.sortAudio && (
            <audio controls>
              <source
                src={`${urlPinata}/${data?.sortAudio}`}
                type="audio/mpeg"
              />
            </audio>
          )}
          {auctioneer &&
            addressUser &&
            auctioneer.toLocaleLowerCase() !==
              addressUser.toLocaleLowerCase() && (
              <button
                className="button-submit"
                onClick={() =>
                  refModal?.current?.open && refModal.current.open()
                }
              >
                Bid
              </button>
            )}
          {auctioneer &&
            addressUser &&
            auctioneer.toLocaleLowerCase() ===
              addressUser.toLocaleLowerCase() && (
              <div className="button-auction">
                <button className="button" onClick={onCancelAuction}>
                  Cancel
                </button>
                <button className="button" onClick={onFinishAuction}>
                  Finish
                </button>
              </div>
            )}
        </div>
        <ModalMessage
          title="Bid Auction"
          ref={refModal}
          children={
            <>
              <FormAuction />
            </>
          }
        />
      </>
    );
  }
  return <></>;
};
