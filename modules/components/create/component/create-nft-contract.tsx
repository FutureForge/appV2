import { Button, cn, Label, Select, TextField } from "@/modules/app";
import { useCreateNFTContractMutation } from "@/modules/mutation";
import { useUserNFTContractQuery } from "@/modules/query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Drawer } from "vaul";
import { useWindowSize } from "@uidotdev/usehooks";

type CreateNFTContractProps = {
  onGoToCreate: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
};
export default function CreateNFTContract({
  onGoToCreate,
  isDrawerOpen,
  setIsDrawerOpen,
}: CreateNFTContractProps) {
  const { data: userNFTContract, isLoading: isLoadingUserNFTContract } =
    useUserNFTContractQuery();
  const createNFTContractMutation = useCreateNFTContractMutation();
  const { width } = useWindowSize();
  const isMobile = width && width <= 440;

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
    <>
      {isMobile ? (
        <MobileView
          isDisabled={isDisabled}
          selectedContract={selectedContract}
          setSelectedContract={setSelectedContract}
          onGoToCreate={onGoToCreate}
          userNFTContract={userNFTContract}
          isLoadingUserNFTContract={isLoadingUserNFTContract}
          handleNameChange={handleNameChange}
          name={name}
          setSymbol={setSymbol}
          symbol={symbol}
          handleCreateNFTContract={handleCreateNFTContract}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      ) : (
        <div className="px-4 flex items-center justify-center w-full max-h-[500px] h-full">
          <div className="min-[600px]:w-[530px] w-full flex flex-col bg-tertiary rounded-3xl p-6 h-full">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={onGoToCreate}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-300 ease-in-out flex items-center gap-2"
                aria-label="Go back"
              >
                <ArrowLeft className="size-5" />
                <h1 className="text-xl font-semibold">Create an NFT</h1>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="lg:overflow-y-auto flex-grow px-1 scrollbar-none">
                <div className="w-full">
                  <Label className="mb-2">List of your collections</Label>
                  {isLoadingUserNFTContract ? (
                    <div className="rounded-lg !w-full h-[42px] skeleton-el" />
                  ) : (
                    <div className="w-full">
                      <Select.Root
                        value={selectedContract}
                        onValueChange={(value) => setSelectedContract(value)}
                        aria-label="Choose NFT collection"
                      >
                        <Select.Trigger className="w-full justify-between [&[data-state=open]_svg]:rotate-90 [&_svg]:shrink-0 transition-all duration-300 ease-in-out">
                          <Button
                            shape="square"
                            variant="secondary"
                            className="rounded-xl h-[42px] px-4 text-muted-foreground"
                          >
                            <Select.Value placeholder="Choose a collection" />
                            <Select.Icon />
                          </Button>
                        </Select.Trigger>
                        <Select.Content className="min-h-[150px] border border-border">
                          {userNFTContract && userNFTContract.length > 0 ? (
                            userNFTContract.map((contract) => (
                              <Select.Item
                                key={contract.contractAddress}
                                value={contract.contractAddress}
                              >
                                {contract.name}
                              </Select.Item>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-gray-500 text-center">
                              No collections found
                            </div>
                          )}
                        </Select.Content>
                      </Select.Root>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Label htmlFor="contractName">Contract Name</Label>
                <TextField
                  id="contractName"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="Name"
                  containerClass="bg-border border-0"
                />
              </div>

              <div className="flex flex-col gap-4">
                <Label htmlFor="symbol">Contract Name</Label>
                <TextField
                  id="symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="Symbol"
                  containerClass="bg-border border-0"
                />
              </div>
            </div>
            <div className="flex w-full mt-auto">
              <Button
                onClick={handleCreateNFTContract}
                variant="primary"
                disabled={isDisabled}
                shape="square"
                className="w-full"
              >
                Create NFT Contract
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

type MobileViewProps = {
  isLoadingUserNFTContract: boolean;
  selectedContract: string;
  setSelectedContract: (value: string) => void;
  onGoToCreate: () => void;
  userNFTContract?: { contractAddress: string; name: string }[];
  name: string;
  handleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  symbol: string;
  setSymbol: (value: string) => void;
  handleCreateNFTContract: () => void;
  isDisabled: boolean;
} & CreateNFTContractProps;

function MobileView(props: MobileViewProps) {
  const {
    onGoToCreate,
    isLoadingUserNFTContract,
    selectedContract,
    setSelectedContract,
    userNFTContract,
    handleNameChange,
    name,
    setSymbol,
    symbol,
    handleCreateNFTContract,
    isDisabled,
    isDrawerOpen,
    setIsDrawerOpen,

  } = props;

  return (
    <Drawer.Root
      open={isDrawerOpen}
      onOpenChange={setIsDrawerOpen}
      dismissible={!isDisabled}
    >
      <Drawer.Content
        className={cn(
          "rounded-tr-3xl rounded-tl-3xl border border-border bg-tertiary max-h-[500px] h-full fixed bottom-0 left-0 right-0"
        )}
      >
        <div className="w-full flex flex-col p-6 h-full">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onGoToCreate}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-300 ease-in-out flex items-center gap-2"
              aria-label="Go back"
            >
              <ArrowLeft className="size-5" />
              <h1 className="text-xl font-semibold">Create an NFT</h1>
            </button>
          </div>
          <div className="flex flex-col gap-4">
            <div className="lg:overflow-y-auto flex-grow px-1 scrollbar-none">
              <div className="w-full">
                <Label className="mb-2">List of your collections</Label>
                {isLoadingUserNFTContract ? (
                  <div className="rounded-lg !w-full h-[42px] skeleton-el" />
                ) : (
                  <div className="w-full">
                    <Select.Root
                      value={selectedContract}
                      onValueChange={(value) => setSelectedContract(value)}
                      aria-label="Choose NFT collection"
                    >
                      <Select.Trigger className="w-full justify-between [&[data-state=open]_svg]:rotate-90 [&_svg]:shrink-0 transition-all duration-300 ease-in-out">
                        <Button
                          shape="square"
                          variant="secondary"
                          className="rounded-xl h-[42px] px-4 text-muted-foreground"
                        >
                          <Select.Value placeholder="Choose a collection" />
                          <Select.Icon />
                        </Button>
                      </Select.Trigger>
                      <Select.Content className="min-h-[150px] border border-border">
                        {userNFTContract && userNFTContract.length > 0 ? (
                          userNFTContract.map((contract) => (
                            <Select.Item
                              key={contract.contractAddress}
                              value={contract.contractAddress}
                            >
                              {contract.name}
                            </Select.Item>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-gray-500 text-center">
                            No collections found
                          </div>
                        )}
                      </Select.Content>
                    </Select.Root>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="contractName">Contract Name</Label>
              <TextField
                id="contractName"
                value={name}
                onChange={handleNameChange}
                placeholder="Name"
                containerClass="bg-border border-0"
              />
            </div>

            <div className="flex flex-col gap-4">
              <Label htmlFor="symbol">Contract Name</Label>
              <TextField
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="Symbol"
                containerClass="bg-border border-0"
              />
            </div>
          </div>
          <div className="flex w-full mt-auto">
            <Button
              onClick={handleCreateNFTContract}
              variant="primary"
              disabled={isDisabled}
              shape="square"
              className="w-full"
            >
              Create NFT Contract
            </Button>
          </div>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
}
