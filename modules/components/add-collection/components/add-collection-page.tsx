import {
  Button,
  FileInput,
  Label,
  ScrollArea,
  TextArea,
  TextField,
} from "@/modules/app";
import React, { ChangeEvent, FormEvent, useState } from "react";
// icons
import DownloadIcon from "@/assets/download.svg";
import X from "@/assets/logo-x-twitter.svg";
import Discord from "@/assets/discord.svg";
import Telegram from "@/assets/telegram.svg";
import { useAddCollectionMutation } from "@/modules/mutation";
import { Social } from "@/utils/types/global";

export function AddCollectionsPage() {
  const addCollectionMutation = useAddCollectionMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contractAddress: "",
    collectionSocials: [
      { socialName: "twitter", socialLink: "" },
      { socialName: "discord", socialLink: "" },
      { socialName: "telegram", socialLink: "" },
    ],
  });

  const [image, setImage] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialChange = (
    index: number,
    field: keyof Social,
    value: string
  ) => {
    setFormData((prev) => {
      const newSocials = [...prev.collectionSocials];
      newSocials[index] = { ...newSocials[index], [field]: value };
      return { ...prev, collectionSocials: newSocials };
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (e.target.name === "image") {
        setImage(file);
      } else {
        setBackgroundImage(file);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!image || !backgroundImage) {
      alert("Please select both images");
      return;
    }

    try {
      await addCollectionMutation.mutateAsync(
        {
          ...formData,
          image,
          backgroundImage,
        },
        {
          onSuccess: () => {
            setFormData({
              contractAddress: "",
              name: "",
              description: "",
              collectionSocials: [
                { socialName: "twitter", socialLink: "" },
                { socialName: "discord", socialLink: "" },
                { socialName: "telegram", socialLink: "" },
              ],
            });
            setImage(null);
            setBackgroundImage(null);
          },
        }
      );
    } catch (error) {
      console.error("Error adding collection:", error);
    }
  };

  const isDisabled =
    !formData.name ||
    !formData.description ||
    !formData.contractAddress ||
    !addCollectionMutation.isPending;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h4 className="font-medium text-[28px]">Add Collections</h4>
        <p className="text-muted-foreground">
          Make sure you’re the owner of the collection
        </p>
      </div>
      <div className="flex items-center justify-center gap-7">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="border-dashed border relative border-primary p-4 max-[1450px]:h-[230px] flex items-center justify-center w-[504px] rounded-3xl">
              <FileInput
                id="image"
                name="image"
                onChange={handleFileChange}
                subTitle="Upload Image"
                icon={<DownloadIcon className="size-10" />}
              />
              <div className="bg-gradient-to-t from-black/50 to-transparent w-full absolute -bottom-2 left-0 right-0 h-40" />
            </div>
            <div className="border-dashed border relative border-primary p-4 max-[1450px]:h-[230px] flex items-center justify-center w-[504px] rounded-3xl">
              <FileInput
                id="backgroundImage"
                name="backgroundImage"
                onChange={handleFileChange}
                subTitle="Upload Background"
                icon={<DownloadIcon className="size-10" />}
              />
              <div className="bg-gradient-to-t from-black/50 to-transparent w-full absolute -bottom-2 left-0 right-0 h-40" />
            </div>
          </div>
          <div className="w-[504px] max-[1450px]:h-[482px] bg-tertiary p-6 flex flex-col rounded-3xl">
            <ScrollArea>
              <div className="lg:overflow-y-auto flex-grow px-1 scrollbar-none">
                <div className="w-full flex flex-col gap-5">
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="name">Display Name</Label>
                    <TextField
                      value={formData.name}
                      onChange={handleInputChange}
                      type="text"
                      id="name"
                      placeholder="Your e-mail"
                      containerClass="bg-border border-0"
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="description">Description</Label>
                    <TextArea
                      placeholder="Description"
                      value={formData.description}
                      onChange={handleInputChange}
                      id="description"
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="traits">Contract Address</Label>
                      <TextField
                        value={formData.contractAddress}
                        onChange={handleInputChange}
                        type="text"
                        id="name"
                        placeholder="Address"
                        containerClass="bg-border border-0"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      {formData.collectionSocials.map((social, index) => (
                        <div key={index}>
                          <TextField
                            value={social.socialLink}
                            icon={
                              <span className="bg-tertiary size-7 rounded-lg min-w-7 flex items-center justify-center">
                                {social.socialName === "twitter" ? (
                                  <X />
                                ) : social.socialName === "discord" ? (
                                  <Discord />
                                ) : (
                                  <Telegram />
                                )}
                              </span>
                            }
                            onChange={(e) =>
                              handleSocialChange(
                                index,
                                "socialLink",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="mt-4 flex items-center justify-end gap-3">
              <Button
                type="submit"
                disabled={isDisabled}
                shape="square"
                className="w-full"
              >
                Mint NFT
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
