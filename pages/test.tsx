import {
  useAllAuctionsQuery,
  useAllListingsQuery,
  useAllOffersQuery,
  useAuctionClosedQuery,
  useNewAuctionsQuery,
  useNewOffersQuery,
  useNewSaleListingsQuery,
} from "@/modules/query";

export default function Test() {
  const { data, isLoading, isError, error } = useNewSaleListingsQuery();

  console.log({ data, isLoading, isError, error });

  return <h1>HELLO WORLD</h1>;
}
