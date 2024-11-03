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
} from "@/modules/query";

export default function Test() {
  //   const { data, isLoading, isError, error } = useFilteredAllListingsQuery({
  //     contractAddress: "0x544c945415066564b0fb707c7457590c0585e838",
  //   });

  //   const { data: allData } = useAllListingsQuery();

  const { data, isLoading, isError, error } = useSingleCollectionQuery({
    contractAddress: "0x544c945415066564b0fb707c7457590c0585e838",
  });

  console.log({ data, isLoading, isError, error });

  return <h1>HELLO WORLD</h1>;
}
