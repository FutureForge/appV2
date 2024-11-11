import {
  Button,
  FileInput,
  Label,
  ScrollArea,
  TextArea,
  TextField,
} from "@/modules/app";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
// icons
import DownloadIcon from "@/assets/download.svg";
import X from "@/assets/logo-x-twitter.svg";
import Discord from "@/assets/discord.svg";
import Telegram from "@/assets/telegram.svg";
import { useAddCollectionMutation } from "@/modules/mutation";
import { Social } from "@/utils/types/global";
import {
  isNFTContract,
  useAllCollectionsQuery,
  useCheckIfItsACollectionQuery,
} from "@/modules/query";
import { validateSocialLink } from "../add-collection.utils";

export function AddCollectionsPage() {
  const addCollectionMutation = useAddCollectionMutation();
  const { data: collections } = useAllCollectionsQuery();

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
  const [NFTContract, setNFTContract] = useState<boolean>();
  const [collectionExist, setCollectionExist] = useState<boolean>();
  const [socialErrors, setSocialErrors] = useState<Record<number, string>>({});
  const [nftName, setNFTName] = useState("");

  const { data: collectionInfo } = useCheckIfItsACollectionQuery({
    contractAddress: formData.contractAddress,
  });

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
    const error = validateSocialLink(
      formData.collectionSocials[index].socialName,
      value
    );

    setSocialErrors((prev) => ({
      ...prev,
      [index]: error,
    }));

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
          onError: () => {
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

  useEffect(() => {
    if (collections) {
      const collectionExist = collections.some(
        (collection) =>
          collection.collectionAddress === formData.contractAddress
      );
      setCollectionExist(collectionExist);
    }
  }, [collections, formData.contractAddress]);

  useEffect(() => {
    const checkIfNFT721Contract = async () => {
      if (formData.contractAddress) {
        const result = await isNFTContract(formData.contractAddress);
        setNFTContract(result);
      }
    };
    checkIfNFT721Contract();
  }, [formData.contractAddress]);

  useEffect(() => {
    setNFTName(collectionInfo?.nftData?.[0]?.name);
  }, [collectionInfo]);

  const isDisabled =
    !formData.name ||
    !formData.description ||
    !formData.contractAddress ||
    !addCollectionMutation.isPending ||
    (formData.contractAddress && !NFTContract) ||
    (formData.contractAddress && collectionExist) ||
    Object.values(socialErrors).some((error) => error !== "");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h4 className="font-medium text-[28px]">Add Collections</h4>
        <p className="text-muted-foreground">
          Make sure you’re the owner of the collection
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center gap-7"
      >
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
                <div className="flex flex-col gap-2">
                  <Label htmlFor="traits">Contract Address</Label>
                  <TextField
                    value={formData.contractAddress}
                    onChange={handleInputChange}
                    type="text"
                    id="contractAddress"
                    name="contractAddress"
                    placeholder="Collection Contract Address"
                    containerClass="bg-border border-0"
                    required
                  />
                  {formData.contractAddress && !NFTContract && (
                    <p className="text-error text-sm font-medium">
                      Not a Valid CFC-721 token
                    </p>
                  )}
                  {formData.contractAddress && collectionExist && (
                    <p className="text-error text-sm font-medium">
                      Collection already in Marketplace
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="name">Display Name</Label>
                    <TextField
                      value={nftName || formData.name}
                      onChange={handleInputChange}
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Collection Name"
                      containerClass="bg-border border-0"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <Label htmlFor="description">Description</Label>
                    <TextArea
                      placeholder="Collection Description"
                      value={formData.description}
                      onChange={handleInputChange}
                      id="description"
                      name="description"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-4 pb-1">
                    {formData.collectionSocials.map((social, index) => (
                      <div key={index} className="flex flex-col gap-1">
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
                          containerClass="bg-border px-2 border-0"
                        />
                        {socialErrors[index] && (
                          <span className="text-error text-sm">
                            {socialErrors[index]}
                          </span>
                        )}
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
              Add Collection
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
