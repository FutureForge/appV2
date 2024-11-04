import {
  useAllAuctionsQuery,
  useAllCollectionsQuery,
  useAllListingsQuery,
  useAllOffersQuery,
  useAuctionClosedQuery,
  useFilteredAllListingsQuery,
  useFilteredNewSaleListingsQuery,
  useNewAuctionsQuery,
  useNewOffersQuery,
  useNewSaleListingsQuery,
  useSingleCollectionQuery,
  useSingleNFTQuery,
  useUserNFTsQuery,
  useUserOffersQuery,
  useUserAuctionsQuery,
  useUserListingsQuery,
  useUserOffersReceivedQuery,
  useUserExpiredListingsQuery,
  useUserExpiredAuctionsQuery,
  useUserExpiredOffersQuery,
} from "@/modules/query";
import { useAddCollectionMutation } from "@/modules/mutation";
import { useState, ChangeEvent, FormEvent } from "react";
import { Social } from "@/utils/types/global";

// "0x1a35a38630b6f56637268f437493601dbf72e61a"
// 8

export default function Test() {
  const { data } = useAllCollectionsQuery();
  console.log({ data });

  // const { data: singleNFT } = useSingleNFTQuery({
  //   contractAddress: "0x1a35a38630b6f56637268f437493601dbf72e61a",
  //   tokenId: "8",
  // });

  // console.log({ singleNFT });

  const [formData, setFormData] = useState({
    contractAddress: "",
    name: "",
    description: "",
    collectionSocials: [{ socialName: "", socialLink: "" }],
  });
  const [image, setImage] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);

  const addCollectionMutation = useAddCollectionMutation();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialChange = (
    index: number,
    field: keyof Social,
    value: string
  ) => {
    setFormData((prev) => {
      const newSocials = [...prev.collectionSocials];
      newSocials[index] = { ...newSocials[index], [field]: value };
      return { ...prev, collectionSocials: newSocials };
    });
  };

  const addSocialField = () => {
    setFormData((prev) => ({
      ...prev,
      collectionSocials: [
        ...prev.collectionSocials,
        { socialName: "", socialLink: "" },
      ],
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (e.target.name === "image") {
        setImage(file);
      } else {
        setBackgroundImage(file);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!image || !backgroundImage) {
      alert("Please select both images");
      return;
    }

    try {
      await addCollectionMutation.mutateAsync(
        {
          ...formData,
          image,
          backgroundImage,
        },
        {
          onSuccess: () => {
            setFormData({
              contractAddress: "",
              name: "",
              description: "",
              collectionSocials: [{ socialName: "", socialLink: "" }],
            });
            setImage(null);
            setBackgroundImage(null);
          },
        }
      );
    } catch (error) {
      console.error("Error adding collection:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <label htmlFor="contractAddress" className="block mb-2">
          Contract Address:
        </label>
        <input
          type="text"
          id="contractAddress"
          name="contractAddress"
          value={formData.contractAddress}
          onChange={handleInputChange}
          className="w-full p-2 border rounded text-black"
          autoComplete="off"
          required
        />
      </div>

      <div>
        <label htmlFor="name" className="block mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-2 border rounded text-black"
          autoComplete="off"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-2">
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 border rounded text-black"
          autoComplete="off"
          required
        />
      </div>

      <div>
        <label htmlFor="image" className="block mb-2">
          Collection Image:
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="backgroundImage" className="block mb-2">
          Background Image:
        </label>
        <input
          type="file"
          id="backgroundImage"
          name="backgroundImage"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2">Collection Socials:</label>
        {formData.collectionSocials.map((social, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Social Name"
              value={social.socialName}
              onChange={(e) =>
                handleSocialChange(index, "socialName", e.target.value)
              }
              className="w-1/2 p-2 border rounded text-black"
            />
            <input
              type="text"
              placeholder="Social Link"
              value={social.socialLink}
              onChange={(e) =>
                handleSocialChange(index, "socialLink", e.target.value)
              }
              className="w-1/2 p-2 border rounded text-black"
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    collectionSocials: prev.collectionSocials.filter(
                      (_, i) => i !== index
                    ),
                  }));
                }}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSocialField}
          className="w-full p-2 bg-gray-500 text-white rounded"
        >
          Add Social Link
        </button>
      </div>

      <button
        type="submit"
        disabled={addCollectionMutation.isPending}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {addCollectionMutation.isPending
          ? "Adding Collection..."
          : "Add Collection"}
      </button>
    </form>
  );
}
