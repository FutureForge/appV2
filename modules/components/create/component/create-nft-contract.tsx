import { Button, Label, TextField } from "@/modules/app";
import { useCreateNFTContractMutation } from "@/modules/mutation";
import { useUserNFTContractQuery } from "@/modules/query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function CreateNFTContract() {
  const router = useRouter();
  const { data: userNFTContract, isLoading: isLoadingUserNFTContract } =
    useUserNFTContractQuery();
  const createNFTContractMutation = useCreateNFTContractMutation();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [selectedContract, setSelectedContract] = useState<string>("");

  const generateSymbolSuggestion = (name: string): string => {
    return name
      .replace(/([A-Z])/g, " $1")
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSymbol(generateSymbolSuggestion(newName));
  };

  const handleCreateNFTContract = () => {
    createNFTContractMutation.mutate(
      {
        name,
        symbol,
      },
      {
        onSuccess: () => {
          setName("");
          setSymbol("");
        },
        onError: () => {
          setName("");
          setSymbol("");
        },
      }
    );
  };

  const isDisabled = !name || !symbol || createNFTContractMutation.isPending;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-secondary/50 rounded-lg transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-xl font-semibold">Create an NFT</h1>
      </div>
      <div className="lg:overflow-y-auto flex-grow px-1 scrollbar-none">
        <div className="w-full">
          <Label className="mb-2">List of your collections</Label>
          {isLoadingUserNFTContract ? (
            <div className="w-full p-4 rounded-lg bg-tertiary border border-border animate-pulse">
              <div className="h-6 bg-secondary/50 rounded" />
            </div>
          ) : (
            <div className="w-full">
              <select
                value={selectedContract}
                onChange={(e) => setSelectedContract(e.target.value)}
                className="w-full p-4 rounded-lg bg-tertiary border border-border focus:border-primary transition-colors"
                aria-label="Choose NFT collection"
              >
                <option value="">Choose a collection</option>
                {userNFTContract?.map((contract) => (
                  <option
                    key={contract.contractAddress}
                    value={contract.contractAddress}
                  >
                    {contract.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      <TextField value={name} onChange={handleNameChange} placeholder="Name" />
      <TextField
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Symbol"
      />

      <Button
        onClick={handleCreateNFTContract}
        variant="primary"
        disabled={isDisabled}
      >
        Create NFT Contract
      </Button>
    </div>
  );
}
