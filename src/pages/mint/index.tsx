import { useState } from "react";
import { useForm } from "react-hook-form";
import "./style.css";
import axios from "axios";
import { toast } from "react-toastify";
import { minNft } from "../../hooks/mint/contract";

export interface IFormInput {
  image: string;
  name: string;
  description: string;
}

export const MintPage = () => {
  const [file, setFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: any) => {
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
    const formData = new FormData();
    formData.append("file", value.image);
    try {
      setLoading(true);
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: "f25b2e69826b1a9a1422",
            pinata_secret_api_key:
              "f8fee89c0250e0c40abb97bc704de4ff58f3631620f201c7a0f8f7cafd1ef385",
          },
        }
      );
      if (response?.data?.IpfsHash) {
        const responseJson = await axios.post(
          "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          {
            pinataContent: { ...value, image: response.data.IpfsHash },
            pinataMetadata: {
              name: response.data.IpfsHash,
              keyvalues: { ...value, image: response.data.IpfsHash },
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
            onChange={handleFileChange}
          />
          {errors.image && <p className="error">{errors.image.message}</p>}
          {file && (
            <div className="image">
              <img src={file} alt="file-mint" />
            </div>
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
