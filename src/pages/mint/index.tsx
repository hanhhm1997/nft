import { useState } from "react";
import { useForm } from "react-hook-form";
import "./style.css";
import { toast } from "react-toastify";
import { uploadFilePinata } from "../../hooks/common";
import { AES, enc } from "crypto-js";
import axios from "axios";
import { minNft } from "../../hooks/mint/contract";

export interface IFormInput {
  image: string;
  name: string;
  description: string;
  sortAudio: string;
  fullAudio: string;
  password: string;
  tokenId: number;
}

export const MintPage = () => {
  const [file, setFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const encryptFullAudio = (fullAudioUri: string, secretKey: string) => {
    const cipherText = AES.encrypt(fullAudioUri, secretKey);
    return cipherText.toString();
  };
  const handleFileChange = (event: any, name: string) => {
    const file = event.target.files[0];
    if (file) {
      setFile(URL.createObjectURL(file));
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const handleUpload = async (value: any) => {
    try {
      setLoading(true);
      const uploadPromises = [
        uploadFilePinata("file", value.image),
        uploadFilePinata("sortAudio", value.sortAudio?.[0]),
        uploadFilePinata("fullAudio", value.fullAudio?.[0]),
      ];
      let [responseImage, responseSortAudio, responseFullAudio] =
        await Promise.all(uploadPromises);
      if (responseFullAudio) {
        responseFullAudio = encryptFullAudio(responseFullAudio, value.password);
      }

      if (responseFullAudio && responseSortAudio) {
        delete value.password;
        const responseJson = await axios.post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          {
            pinataContent: {
              ...value,
              image: responseImage,
              sortAudio: responseSortAudio,
              fullAudio: responseFullAudio,
            },
            pinataMetadata: {
              name: responseImage,
              keyvalues: {
                ...value,
                image: responseImage,
                sortAudio: responseSortAudio,
                fullAudio: responseFullAudio,
              },
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
              pinata_api_key: "f25b2e69826b1a9a1422",
              pinata_secret_api_key:
                "f8fee89c0250e0c40abb97bc704de4ff58f3631620f201c7a0f8f7cafd1ef385",
            },
          }
        );
        if (responseJson?.data?.IpfsHash) {
          await minNft(responseJson.data.IpfsHash);
          setLoading(false);
          toast.success("Mint is successful");
        }
      }
    } catch (error: any) {
      toast.error(error?.reason);
      setLoading(false);
    }
  };
  const onSubmit = (data: any) => {
    const convertData = { ...data, image: data?.image?.[0] };
    handleUpload(convertData);
  };

  return (
    <>
      <h2 className="title">Mint Your NFT</h2>
      <form className="form-mint" onSubmit={handleSubmit(onSubmit)}>
        <div className="item-form">
          <label>Image</label>
          <input
            type="file"
            accept="image"
            {...register("image", { required: "Image is required" })}
            onChange={(e) => handleFileChange(e, "image")}
          />
          {errors.image && <p className="error">{errors.image.message}</p>}
          {file && (
            <div className="image">
              <img src={file} alt="file-mint" />
            </div>
          )}
        </div>
        <div className="item-form">
          <label>Sort Audio</label>
          <input
            type="file"
            accept="audio/*,video/mp4"
            {...register("sortAudio", { required: "Sort Audio is required" })}
          />
          {errors.sortAudio && (
            <p className="error">{errors.sortAudio.message}</p>
          )}
        </div>
        <div className="item-form">
          <label>FullAudio</label>*
          <input
            type="file"
            accept="audio/*,video/mp4"
            {...register("fullAudio", { required: "Full Audio is required" })}
          />
          {errors.fullAudio && (
            <p className="error">{errors.fullAudio.message}</p>
          )}
        </div>

        <div className="item-form">
          <label>Password</label>
          <input
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <p className="error">{errors.password.message}</p>
          )}
        </div>

        <div className="item-form">
          <label>Name</label>
          <input {...register("name", { required: "Name is required" })} />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>
        <div className="item-form">
          <label>Description</label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <p className="error">{errors.description.message}</p>
          )}
        </div>
        <button className="button-mint" type="submit">
          {loading ? "Minting..." : "Mint"}
        </button>
      </form>
    </>
  );
};
