import {
  useAllAuctionsQuery,
  useAllListingsQuery,
  useCompletedListingsQuery,
  useNewAuctionsQuery,
} from "@/modules/query";

export default function Test() {
  const { data, isLoading, isError } = useNewAuctionsQuery();

  console.log({ data });

  return <h1>HELLO WORLD</h1>;
}
