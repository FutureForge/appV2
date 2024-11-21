import { Button, TextField } from "@/modules/app";
import { useCreateNFTContractMutation } from "@/modules/mutation";
import { useState } from "react";

export default function CreateNFTContract() {
  const createNFTContractMutation = useCreateNFTContractMutation();

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("1");

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
        initialSupply,
      },
      {
        onSuccess: () => {
          setName("");
          setSymbol("");
          setInitialSupply("1");
        },
        onError: () => {
          setName("");
          setSymbol("");
          setInitialSupply("1");
        },
      }
    );
  };

  const isDisabled =
    !name || !symbol || !initialSupply || createNFTContractMutation.isPending;

  return (
    <div>
      <TextField value={name} onChange={handleNameChange} placeholder="Name" />
      <TextField
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Symbol"
      />
      <TextField
        value={initialSupply}
        onChange={(e) => setInitialSupply(e.target.value)}
        placeholder="Initial Supply"
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
