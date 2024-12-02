import React, { useState } from "react";
import {
  Button,
  FileInput,
  Label,
  ScrollArea,
  TextArea,
  TextField,
  Dialog,
  Select,
  ClientOnly,
} from "@/modules/app";
import { useToast } from "@/modules/app/hooks/useToast";
import { useCreateNFTMutation } from "@/modules/mutation";
import DownloadIcon from "@/assets/download.svg";
import {
  useCreationFeeQuery,
  useMintFeeQuery,
  useUserChainInfo,
  useUserNFTContractQuery,
} from "@/modules/query";
import { chainInfo } from "@/utils/configs";
import CreateNFTContract from "./create-nft-contract";
import { useWindowSize } from "@uidotdev/usehooks";
import { SuccessDialog } from "./success-dialog";
import Discord from "@/assets/discord.svg";
import X from "@/assets/logo-x-twitter.svg";
import Telegram from "@/assets/telegram.svg";
import Github from "@/assets/github.svg";
import { useRouter } from "next/navigation";

type Trait = {
  trait_type: string;
  value: string;
};

const shareLinks = [
  { icon: <Discord />, link: "https://discord.com" },
  { icon: <X />, link: "https://twitter.com" },
  { icon: <Telegram />, link: "https://telegram.org" },
  { icon: <Github />, link: "https://github.com" },
];

export function CreatePage() {
  const toast = useToast();
  const router = useRouter();
  const createNFTMutation = useCreateNFTMutation();
  const { activeAccount } = useUserChainInfo();

  const [viewType, setViewType] = useState<"create" | "deploy">("create");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [traits, setTraits] = useState<Trait[]>([]);
  const [showTraitInputs, setShowTraitInputs] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(() => Date.now().toString());
  const [selectedContract, setSelectedContract] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState(true);
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [receipt, setReceipt] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width && width <= 440;

  const { data: userNFTContract, isLoading: isLoadingContracts } =
    useUserNFTContractQuery();
  const { data: mintFee } = useMintFeeQuery();
  const { data: creationFee } = useCreationFeeQuery();

  const handleAddTrait = () => {
    setShowTraitInputs(true);
    setTraits([...traits, { trait_type: "", value: "" }]);
  };

  const handleTraitChange = (
    index: number,
    field: keyof Trait,
    value: string
  ) => {
    const updatedTraits = [...traits];
    updatedTraits[index][field] = value;
    setTraits(updatedTraits);
  };

  const handleRemoveTrait = (index: number) => {
    const updatedTraits = traits.filter((_, i) => i !== index);
    setTraits(updatedTraits);
    if (updatedTraits.length === 0) {
      setShowTraitInputs(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    // setFile(null);
    setTraits([]);
    setFileInputKey(Date.now().toString());
    setSelectedContract("");
  };

  const handleCreateNFT = async () => {
    if (!name || !description || !file || !selectedContract)
      return toast.error("Please fill out all fields");

    createNFTMutation.mutate(
      {
        contractAddress: selectedContract,
        name,
        description,
        file: file!,
        attributes: traits,
      },
      {
        onSuccess: (data) => {
          const tokenId =
            typeof data === "object" && "tokenId" in data ? data.tokenId : null;
          const receipt =
            typeof data === "object" && "receipt" in data ? data.receipt : null;
          setTokenId(tokenId as number);
          setReceipt(receipt);
          setShowSuccessModal(true);
          resetForm();
        },
        onError: () => {
          resetForm();
        },
      }
    );
  };

  const isDisabled =
    !name ||
    !description ||
    !file ||
    createNFTMutation.isPending ||
    !selectedContract ||
    !activeAccount;

  const handleButtonClick = () => {
    if (isMobile) {
      setViewType("deploy");
      setIsDrawerOpen(true);
    } else {
      setViewType("deploy");
    }
  };

  return (
    <>
      {viewType === "create" && (
        <div className="flex items-center max-[909px]:flex-col min-[909px]:justify-center gap-7 w-full max-[909px]:py-8 max-[909px]:px-4">
          {/* Choose File */}
          <div className="border-dashed border max-[909px]:h-full relative border-primary p-4 min-[1120px]:h-[34.75rem] min-[909px]:w-[24.0625rem] min-[909px]:h-[33rem] w-full flex items-center justify-center min-[1120px]:w-[31.5rem] rounded-3xl">
            <FileInput
              key={fileInputKey}
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setFile(selectedFile);
                }
              }}
              icon={<DownloadIcon className="size-[73px]" />}
            />
            <div className="bg-gradient-to-t from-black/50 to-transparent w-full absolute -bottom-2 left-0 right-0 h-40" />
          </div>

          {/* Form */}
          <div className="min-[1120px]:w-[31.5rem] min-[1120px]:h-[34.75rem] min-[909px]:w-[27.4375rem] min-[909px]:h-[33rem] bg-tertiary p-6 flex flex-col rounded-3xl h-full w-full">
            <ScrollArea.Root>
              <div className="lg:overflow-y-auto flex-grow px-1 scrollbar-none">
                <div className="w-full mb-5">
                  <Label className="mb-2">
                    Collection <span className="text-xs text-red-500">*</span>
                  </Label>
                  {isLoadingContracts ? (
                    <div className="rounded-lg !w-full h-[42px] skeleton-el" />
                  ) : userNFTContract?.length === 0 ? (
                    <button
                      onClick={handleButtonClick}
                      className="w-full flex items-center gap-3 h-[42px] p-4 rounded-lg border border-primary hover:bg-primary/10 transition-colors"
                    >
                      <span className="text-2xl">+</span>
                      <span>Create a new collection</span>
                    </button>
                  ) : (
                    <div className="w-full">
                      <Select.Root
                        value={selectedContract}
                        onValueChange={(value) => setSelectedContract(value)}
                        aria-label="Choose NFT collection"
                      >
                        <Select.Trigger className="w-full justify-between [&[data-state=open]_svg]:rotate-90 [&_svg]:shrink-0 transition-all duration-300 ease-in-out">
                          <Button shape="square" variant="secondary">
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
                      <button
                        onClick={handleButtonClick}
                        className="mt-2 text-sm text-primary hover:underline"
                      >
                        Create a new collection
                      </button>
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-col gap-5">
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="name">
                      Token Name <span className="text-xs text-red-500">*</span>
                    </Label>
                    <TextField
                      value={name}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setName(event.target.value)
                      }
                      type="text"
                      id="name"
                      placeholder="Name your NFT"
                      containerClass="bg-border"
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="description">
                      Description{" "}
                      <span className="text-xs text-red-500">*</span>
                    </Label>
                    <TextArea
                      placeholder="Description"
                      value={description}
                      onChange={(
                        event: React.ChangeEvent<HTMLTextAreaElement>
                      ) => setDescription(event.target.value)}
                      id="description"
                    />
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2 min-[1720px]:gap-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="traits">Traits</Label>
                        {showTraitInputs && (
                          <Button
                            variant="secondary"
                            shape="square"
                            onClick={handleAddTrait}
                            className="size-6 flex items-center justify-center"
                          >
                            +
                          </Button>
                        )}
                      </div>
                      {traits.map((trait, index) => (
                        <div key={index} className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <TextField
                              value={trait.trait_type}
                              placeholder="Trait Type"
                              onChange={(event) =>
                                handleTraitChange(
                                  index,
                                  "trait_type",
                                  event.target.value
                                )
                              }
                            />
                            <TextField
                              value={trait.value}
                              placeholder="Value"
                              onChange={(event) =>
                                handleTraitChange(
                                  index,
                                  "value",
                                  event.target.value
                                )
                              }
                            />
                          </div>
                          <Button
                            variant="tertiary"
                            className="w-full"
                            onClick={() => handleRemoveTrait(index)}
                            shape="square"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      {!showTraitInputs && (
                        <Button
                          variant="tertiary"
                          shape="square"
                          className="w-full"
                          onClick={handleAddTrait}
                        >
                          Add Traits
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea.Root>
            <div className="mt-4 flex items-center justify-end gap-3">
              <Button
                onClick={handleCreateNFT}
                disabled={isDisabled}
                shape="square"
                className="w-full"
              >
                {!activeAccount ? "Connect Wallet to Create" : "Create NFT"}
              </Button>
            </div>
          </div>
          {/* Success Modal */}
          <ClientOnly>
            <Dialog.Root
              onOpenChange={setShowSuccessModal}
              open={showSuccessModal}
            >
              <Dialog.Content className="min-[440px]:w-[420px] max-[440px]:h-[60vh]">
                <SuccessDialog
                  src={file ? URL.createObjectURL(file) : ""}
                  name={name}
                  Links={shareLinks}
                  onClick={() => {
                    setFile(null);
                    router.push(`/nft/${selectedContract}/${tokenId}`);
                  }}
                />
              </Dialog.Content>
            </Dialog.Root>
          </ClientOnly>
          {/* Add Success Modal */}
          {/* <Dialog.Root open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <Dialog.Content className="flex flex-col items-center text-center p-6">
          <div className="mb-6">
            <img
              src={file ? URL.createObjectURL(file) : undefined}
              alt="Success"
              className="w-24 h-24"
            />
          </div>
          <h2 className="text-2xl font-bold mb-4">Your item has been minted</h2>
          <div className="flex gap-3 mt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setFile(null);
                router.push(`/collections/${selectedContract}`);
              }}
            >
              View collection
            </Button>
            <Button
              onClick={() => {
                setFile(null);
                router.push(`/nft/${selectedContract}/${tokenId}`);
              }}
            >
              View item
            </Button>
          </div>
          <a
            href={`${chainInfo.blockExplorers?.[0].url}/tx/${receipt?.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-primary hover:underline flex items-center gap-1"
          >
            View on XFIScan
          </a>
        </Dialog.Content>
      </Dialog.Root> */}
        </div>
      )}

      {viewType === "deploy" && (
        <CreateNFTContract
          onGoToCreate={() => setViewType("create")}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      )}
    </>
  );
}
