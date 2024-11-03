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
} from "@/modules/query";
import { useAddCollectionMutation } from "@/modules/mutation";
import { useState, ChangeEvent, FormEvent } from "react";

export default function Test() {
  const { data } = useAllCollectionsQuery();
  console.log({ data });

  const [formData, setFormData] = useState({
    contractAddress: "",
    name: "",
    description: "",
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
