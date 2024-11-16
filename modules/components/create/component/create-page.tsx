import React, { useState } from "react";
import {
  Button,
  FileInput,
  Label,
  ScrollArea,
  TextArea,
  TextField,
} from "@/modules/app";
import { useToast } from "@/modules/app/hooks/useToast";
import { useCreateNFTMutation } from "@/modules/mutation";
import DownloadIcon from "@/assets/download.svg";

type Trait = {
  trait_type: string;
  value: string;
};

export function CreatePage() {
  const toast = useToast();
  const createNFTMutation = useCreateNFTMutation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [traits, setTraits] = useState<Trait[]>([]);
  const [showTraitInputs, setShowTraitInputs] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(() => Date.now().toString());

  console.log({ file });

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
    setFile(null);
    setTraits([]);
    setFileInputKey(Date.now().toString());
  };

  const handleCreateNFT = async () => {
    // if (!name || !description || !file)
    //   return toast.error("Please fill out all fields");

    createNFTMutation.mutate(
      {
        name,
        description,
        file: file!,
        attributes: traits,
      },
      {
        onSuccess: () => {
          resetForm();
        },
        onError: () => {
          resetForm();
        },
      }
    );
  };

  const isDisabled =
    !name || !description || !file || createNFTMutation.isPending;

  return (
    <div className="flex items-center justify-center gap-7">
      {/* Choose File */}
      <div className="border-dashed border relative border-primary p-4 h-[556px] flex items-center justify-center w-[504px] rounded-3xl">
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
      <div className="w-[504px] h-[556px] bg-tertiary p-6 flex flex-col rounded-3xl">
        <ScrollArea>
          <div className="lg:overflow-y-auto flex-grow px-1 scrollbar-none">
            <div className="w-full flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                <Label htmlFor="name">Token Name</Label>
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
                <Label htmlFor="description">Description</Label>
                <TextArea
                  placeholder="Description"
                  value={description}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setDescription(event.target.value)
                  }
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
        </ScrollArea>
        <div className="mt-4 flex items-center justify-end gap-3">
          <Button
            onClick={handleCreateNFT}
            disabled={isDisabled}
            shape="square"
            className="w-full"
          >
            Create NFT
          </Button>
        </div>
      </div>
    </div>
  );
}
