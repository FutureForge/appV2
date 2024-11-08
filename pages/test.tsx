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
  useUserChainInfo,
  useCheckApprovedForAllQuery,
  useFilteredAllAuctionsQuery,
  useUserCollectionsQuery,
} from "@/modules/query";
import {
  useAddCollectionMutation,
  useApprovedForAllMutation,
  useBidInAuctionMutation,
  useBuyFromDirectListingMutation,
  useCollectAuctionPayoutMutation,
  useCreateAuctionMutation,
  useCreateListingMutation,
} from "@/modules/mutation";
import { useState, ChangeEvent, FormEvent } from "react";
import DatePicker from "react-datepicker";

// "0x1a35a38630b6f56637268f437493601dbf72e61a"
// 8

export default function Test() {
  // const { data } = useSingleCollectionQuery({
  //   contractAddress: "0x1A35a38630b6F56637268F437493601dbF72E61A",
  // });
  // console.log({ data });

  // const { data } = useAllCollectionsQuery();
  // console.log({ data });

  // const { data: allListings } = useAllListingsQuery({});
  // console.log({ allListings });

  // const { data: filteredListings } = useFilteredAllListingsQuery({
  //   address: "0xe924512e05c828c0881f46508e27bb59238e87b9",
  // });
  // console.log({ filteredListings });

  // const { data: filteredAuctions } = useFilteredAllAuctionsQuery({
  //   address: "0x348df9bd14475c780a78bf48492b9a29a2032b96",
  // });
  // console.log({ filteredAuctions });

  // const { data: allAuctions } = useAllAuctionsQuery({});
  // console.log({ allAuctions });

  // const listingCreator = allListings?.[0]?.listingCreator;

  const { data: userNFTs } = useUserNFTsQuery();
  console.log({ userNFTs });

  // const { data: singleNFT } = useSingleNFTQuery({
  //   contractAddress: "0x55babee194af5c59a5f17f9dea47be4a37dfb36d",
  //   tokenId: "2",
  // });

  // console.log({ singleNFT });

  // const [formData, setFormData] = useState({
  //   contractAddress: "",
  //   name: "",
  //   description: "",
  //   collectionSocials: [{ socialName: "", socialLink: "" }],
  // });
  // const [image, setImage] = useState<File | null>(null);
  // const [backgroundImage, setBackgroundImage] = useState<File | null>(null);

  // const addCollectionMutation = useAddCollectionMutation();

  // const handleInputChange = (
  //   e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // const handleSocialChange = (
  //   index: number,
  //   field: keyof Social,
  //   value: string
  // ) => {
  //   setFormData((prev) => {
  //     const newSocials = [...prev.collectionSocials];
  //     newSocials[index] = { ...newSocials[index], [field]: value };
  //     return { ...prev, collectionSocials: newSocials };
  //   });
  // };

  // const addSocialField = () => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     collectionSocials: [
  //       ...prev.collectionSocials,
  //       { socialName: "", socialLink: "" },
  //     ],
  //   }));
  // };

  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     if (e.target.name === "image") {
  //       setImage(file);
  //     } else {
  //       setBackgroundImage(file);
  //     }
  //   }
  // };

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   if (!image || !backgroundImage) {
  //     alert("Please select both images");
  //     return;
  //   }

  //   try {
  //     await addCollectionMutation.mutateAsync(
  //       {
  //         ...formData,
  //         image,
  //         backgroundImage,
  //       },
  //       {
  //         onSuccess: () => {
  //           setFormData({
  //             contractAddress: "",
  //             name: "",
  //             description: "",
  //             collectionSocials: [{ socialName: "", socialLink: "" }],
  //           });
  //           setImage(null);
  //           setBackgroundImage(null);
  //         },
  //       }
  //     );
  //   } catch (error) {
  //     console.error("Error adding collection:", error);
  //   }
  // };

  const { activeAccount } = useUserChainInfo();

  const oneWeekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const [selectedDate, setSelectedDate] = useState<Date>(oneWeekFromNow);

  const handleDateChange = (date: Date | null) => {
    const newDate = date || oneWeekFromNow;
    setSelectedDate(newDate);
  };

  const { data: isApproved } = useCheckApprovedForAllQuery({
    collectionContractAddress: userNFTs?.[8]?.contractAddress!,
  });

  console.log({ isApproved });

  // const createListingMutation = useCreateListingMutation();
  // console.log({ createListingMutation });

  const createAuctionMutation = useCreateAuctionMutation();
  console.log({ createAuctionMutation });

  // const bidInAuctionMutation = useBidInAuctionMutation();
  // console.log({ bidInAuctionMutation });

  // const buyListingMutation = useBuyFromDirectListingMutation();
  // console.log({ buyListingMutation });

  // const collectAuctionPayoutMutation = useCollectAuctionPayoutMutation();
  // console.log({ collectAuctionPayoutMutation });

  // const approveMutation = useApprovedForAllMutation();
  // console.log({ approveMutation });

  const handleClick = async () => {
    // if (!isApproved) {
    //   await approveMutation.mutateAsync({
    //     collectionContractAddress: userNFTs?.[8]?.contractAddress!,
    //   });
    // }
    // createListingMutation.mutateAsync({
    //   directListing: {
    //     assetContract: userNFTs?.[0]?.contractAddress!,
    //     tokenId: userNFTs?.[0]?.tokenId!,
    //     quantity: "1",
    //     pricePerToken: "11",
    //     endTimestamp: selectedDate,
    //   },
    // });
    createAuctionMutation.mutateAsync({
      auctionDetails: {
        assetContract: userNFTs?.[0]?.contractAddress!,
        tokenId: userNFTs?.[0]?.tokenId!,
        quantity: "1",
        minimumBidAmount: "2.3",
        buyoutBidAmount: "7.9",
        endTimestamp: selectedDate,
      },
    });
    // bidInAuctionMutation.mutateAsync({
    //   auctionId: "6",
    //   bidAmount: "5",
    // });
    // buyListingMutation.mutateAsync({
    //   buyFromListing: {
    //     listingId: "4",
    //     buyFor: activeAccount?.address!,
    //     quantity: "1",
    //     totalPrice: "11",
    //     nativeTokenValue: "11",
    //   },
    // });
    // collectAuctionPayoutMutation.mutateAsync({
    //   auctionId: "6",
    // });
  };

  return (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        placeholderText={"Date"}
        className="bg-background border border-dialog-border rounded-xl w-1/2 py-[.625rem] px-2.5 text-sm"
        minDate={new Date()}
      />
      {/* <div className="bg-background border border-dialog-border rounded-xl flex justify-between w-[65%] py-[.625rem] px-2.5">
        <p className="font-medium text-sm">
          {selectedDate ? selectedDate.toDateString() : "Select Date"}
        </p>
        <p className="font-medium text-sm">
          {selectedDate ? selectedDate.toLocaleTimeString() : "Time"}
        </p>
      </div> */}
      <button onClick={handleClick}>Click</button>
    </div>
    // <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
    //   <div>
    //     <label htmlFor="contractAddress" className="block mb-2">
    //       Contract Address:
    //     </label>
    //     <input
    //       type="text"
    //       id="contractAddress"
    //       name="contractAddress"
    //       value={formData.contractAddress}
    //       onChange={handleInputChange}
    //       className="w-full p-2 border rounded text-black"
    //       autoComplete="off"
    //       required
    //     />
    //   </div>

    //   <div>
    //     <label htmlFor="name" className="block mb-2">
    //       Name:
    //     </label>
    //     <input
    //       type="text"
    //       id="name"
    //       name="name"
    //       value={formData.name}
    //       onChange={handleInputChange}
    //       className="w-full p-2 border rounded text-black"
    //       autoComplete="off"
    //       required
    //     />
    //   </div>

    //   <div>
    //     <label htmlFor="description" className="block mb-2">
    //       Description:
    //     </label>
    //     <textarea
    //       id="description"
    //       name="description"
    //       value={formData.description}
    //       onChange={handleInputChange}
    //       className="w-full p-2 border rounded text-black"
    //       autoComplete="off"
    //       required
    //     />
    //   </div>

    //   <div>
    //     <label htmlFor="image" className="block mb-2">
    //       Collection Image:
    //     </label>
    //     <input
    //       type="file"
    //       id="image"
    //       name="image"
    //       onChange={handleFileChange}
    //       accept="image/*"
    //       className="w-full p-2 border rounded"
    //       required
    //     />
    //   </div>

    //   <div>
    //     <label htmlFor="backgroundImage" className="block mb-2">
    //       Background Image:
    //     </label>
    //     <input
    //       type="file"
    //       id="backgroundImage"
    //       name="backgroundImage"
    //       onChange={handleFileChange}
    //       accept="image/*"
    //       className="w-full p-2 border rounded"
    //       required
    //     />
    //   </div>

    //   <div>
    //     <label className="block mb-2">Collection Socials:</label>
    //     {formData.collectionSocials.map((social, index) => (
    //       <div key={index}>
    //         <input
    //           type="text"
    //           placeholder="Social Name"
    //           value={social.socialName}
    //           onChange={(e) =>
    //             handleSocialChange(index, "socialName", e.target.value)
    //           }
    //           className="w-1/2 p-2 border rounded text-black"
    //         />
    //         <input
    //           type="text"
    //           placeholder="Social Link"
    //           value={social.socialLink}
    //           onChange={(e) =>
    //             handleSocialChange(index, "socialLink", e.target.value)
    //           }
    //           className="w-1/2 p-2 border rounded text-black"
    //         />
    //         {index > 0 && (
    //           <button
    //             type="button"
    //             onClick={() => {
    //               setFormData((prev) => ({
    //                 ...prev,
    //                 collectionSocials: prev.collectionSocials.filter(
    //                   (_, i) => i !== index
    //                 ),
    //               }));
    //             }}
    //             className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    //           >
    //             ×
    //           </button>
    //         )}
    //       </div>
    //     ))}
    //     <button
    //       type="button"
    //       onClick={addSocialField}
    //       className="w-full p-2 bg-gray-500 text-white rounded"
    //     >
    //       Add Social Link
    //     </button>
    //   </div>

    //   <button
    //     type="submit"
    //     disabled={addCollectionMutation.isPending}
    //     className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
    //   >
    //     {addCollectionMutation.isPending
    //       ? "Adding Collection..."
    //       : "Add Collection"}
    //   </button>
    // </form>
  );
}
