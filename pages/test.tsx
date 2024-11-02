import {
  useAllListingsQuery,
  useCompletedListingsQuery,
} from "@/modules/query";

export default function Test() {
  const { data, isLoading, isError } = useCompletedListingsQuery();

  console.log({ data });

  return <h1>HELLO WORLD</h1>;
}
