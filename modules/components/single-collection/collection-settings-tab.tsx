import { useState, useRef } from "react";
import Image from "next/image";
import { Button, Label, TextField, TextArea } from "@/modules/app";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useUpdateCollectionMutation } from "@/modules/mutation";
import { getFormatAddress } from "@/utils/functions";
import { useSingleCollectionInfoQuery } from "@/modules/query";

import CopyIcon from "@/assets/copy.svg";
import LinkIcon2 from "@/assets/link-01.svg";
import X from "@/assets/logo-x-twitter.svg";
import Discord from "@/assets/discord.svg";
import Telegram from "@/assets/telegram.svg";
import { validateSocialLink } from "../add-collection/add-collection.utils";
import { Social } from "@/utils/types/global";

interface CollectionSettingsTabProps {
  collectionAddress: string;
}

export const CollectionSettingsTab = ({
  collectionAddress,
}: CollectionSettingsTabProps) => {
  const { data: singleCollectionInfo } = useSingleCollectionInfoQuery({
    contractAddress: collectionAddress,
  });

  const { collection } = singleCollectionInfo || {};
  const { collectionName, collectionSocials, collectionDescription } =
    collection || {};

  const updateCollectionMutation = useUpdateCollectionMutation();
  const [newCollectionImage, setNewCollectionImage] = useState<File | null>(
    null
  );
  const [newCollectionBackgroundImage, setNewCollectionBackgroundImage] =
    useState<File | null>(null);
  const [socialErrors, setSocialErrors] = useState<Record<number, string>>({});

  const [formData, setFormData] = useState({
    name: collectionName || "",
    description: collectionDescription || "",
    collectionSocials: [
      {
        socialName: "twitter",
        socialLink: collectionSocials?.[0]?.socialLink || "",
      },
      {
        socialName: "discord",
        socialLink: collectionSocials?.[1]?.socialLink || "",
      },
      {
        socialName: "telegram",
        socialLink: collectionSocials?.[2]?.socialLink || "",
      },
    ],
  });

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const VALID_FILE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/avif",
  ];

  const copyToClipboard = useCopyToClipboard()[1];
  const handleCopy = (content: string) => {
    if (content) {
      copyToClipboard(content);
    }
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "background"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!VALID_FILE_TYPES.includes(file.type)) {
        alert(
          "Invalid file type. Please upload a JPG, PNG, GIF, WEBP, or AVIF file."
        );
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
        return;
      }

      if (type === "image") {
        setNewCollectionImage(file);
      } else {
        setNewCollectionBackgroundImage(file);
      }
    }
  };

  const isEdited =
    formData.name !== collection?.collectionName ||
    formData.description !== collection?.collectionDescription ||
    newCollectionImage !== null ||
    newCollectionBackgroundImage !== null ||
    JSON.stringify(formData.collectionSocials) !==
      JSON.stringify(collection?.collectionSocials);

  const isDisabled =
    Object.values(socialErrors).some((error) => error !== "") ||
    !isEdited ||
    updateCollectionMutation.isPending;

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

  const handleSubmit = () => {
    if (!collection) return;

    updateCollectionMutation.mutate(
      {
        ...formData,
        collectionId: collection._id,
        contractAddress: collection.collectionAddress,
        image: newCollectionImage,
        backgroundImage: newCollectionBackgroundImage,
      },
      {
        onSuccess: () => {
          setFormData({
            name: collection.collectionName,
            description: collection.collectionDescription,
            collectionSocials: [
              { socialName: "twitter", socialLink: "" },
              { socialName: "discord", socialLink: "" },
              { socialName: "telegram", socialLink: "" },
            ],
          });
          setNewCollectionImage(null);
          setNewCollectionBackgroundImage(null);
        },
        onError: () => {
          setFormData({
            name: collection.collectionName,
            description: collection.collectionDescription,
            collectionSocials: [
              { socialName: "twitter", socialLink: "" },
              { socialName: "discord", socialLink: "" },
              { socialName: "telegram", socialLink: "" },
            ],
          });
          setNewCollectionImage(null);
          setNewCollectionBackgroundImage(null);
        },
      }
    );
  };

  if (!collection) return null;

  return (
    <div className="flex items-start w-full max-sm:flex-col gap-8 mt-8 h-full">
      <div className="flex items-center max-[1246px]:flex-col gap-4 flex-1 max-sm:flex-row max-sm:w-full">
        {/* Collection Image */}
        <div className="relative w-[392px] h-[447px] max-[1246px]:h-[282px] max-[1246px]:w-full max-sm:w-full max-sm:h-[180px]">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <Image
            src={
              newCollectionImage
                ? URL.createObjectURL(newCollectionImage)
                : collection.collectionImage
            }
            alt="Collection Image"
            layout="fill"
            className="object-cover rounded-lg cursor-pointer"
            onClick={() => imageFileInputRef.current?.click()}
          />
          <input
            placeholder="Collection Image"
            type="file"
            accept="image/*"
            ref={imageFileInputRef}
            onChange={(e) => handleImageChange(e, "image")}
            style={{ display: "none" }}
          />
          <button
            onClick={() => imageFileInputRef.current?.click()}
            className="absolute top-1/2 left-1/2 transform z-20 text-sm -translate-x-1/2 -translate-y-1/2 p-2 bg-card border border-border text-white rounded-lg"
          >
            Change Image
          </button>
        </div>

        {/* Collection Background Image */}
        <div className="relative w-[392px] h-[447px] max-[1246px]:h-[282px] max-[1246px]:w-full max-sm:w-full max-sm:h-[180px]">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <Image
            src={
              newCollectionBackgroundImage
                ? URL.createObjectURL(newCollectionBackgroundImage)
                : collection.collectionBackgroundImage
            }
            layout="fill"
            alt="Collection Background"
            className="object-cover rounded-lg cursor-pointer"
            onClick={() => backgroundFileInputRef.current?.click()}
          />
          <input
            placeholder="Collection Background Image"
            type="file"
            accept="image/*"
            ref={backgroundFileInputRef}
            onChange={(e) => handleImageChange(e, "background")}
            style={{ display: "none" }}
          />
          <button
            onClick={() => backgroundFileInputRef.current?.click()}
            className="absolute top-1/2 left-1/2 text-sm transform z-20 -translate-x-1/2 -translate-y-1/2 p-2 bg-card border border-border text-white rounded-lg"
          >
            Change Background
          </button>
        </div>
      </div>

      <div className="w-[50%] max-sm:w-full max-sm:pb-10 flex flex-col h-[447px] max-[1246px]:h-[578px] max-sm:h-full">
        <div className="flex items-center gap-5 w-full">
          <div className="flex flex-col gap-3 w-full">
            <Label htmlFor="name">Collection Name</Label>
            <TextField
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="text-muted-foreground"
              containerClass="bg-tertiary  border-0"
              collectionIcon={
                <CopyIcon
                  onClick={() => handleCopy(formData.name)}
                  className="size-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors duration-300 ease-in-out"
                />
              }
            />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Label htmlFor="contract">Project Contract</Label>
            <TextField
              id="contract"
              value={getFormatAddress(collection.collectionAddress)}
              disabled
              className="text-muted-foreground"
              containerClass="bg-tertiary  border-0"
              collectionIcon={
                <CopyIcon
                  onClick={() => handleCopy(collection.collectionAddress)}
                  className="size-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors duration-300 ease-in-out"
                />
              }
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full mt-4">
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="text-muted-foreground border-0 bg-tertiary"
          />
        </div>

        <div className="flex w-full flex-col gap-6 max-sm:mt-6 max-sm:items-start items-end mt-auto">
          <span className="max-sm:text-xs text-sm flex items-center gap-2">
            <LinkIcon2 className="size-5 max-sm:size-3" />
            Social Links
          </span>
          <div className="flex items-start justify-start gap-4 max-sm:flex-col max-sm:w-full">
            {formData.collectionSocials.map((social, index) => (
              <div key={index} className="flex flex-col gap-1 w-full">
                <TextField
                  value={social.socialLink}
                  icon={
                    <span className="size-7 rounded-lg min-w-7 flex items-center justify-center">
                      {social.socialName === "twitter" ? (
                        <X className="size-3 text-muted-foreground" />
                      ) : social.socialName === "discord" ? (
                        <Discord className="size-3 text-muted-foreground" />
                      ) : (
                        <Telegram className="size-3 text-muted-foreground" />
                      )}
                    </span>
                  }
                  onChange={(e) =>
                    handleSocialChange(index, "socialLink", e.target.value)
                  }
                  containerClass="bg-transparent px-2 text-muted-foreground"
                />
                {socialErrors[index] && (
                  <span className="text-error text-sm">
                    {socialErrors[index]}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="w-full">
            <Button
              disabled={isDisabled}
              className="w-full"
              shape="square"
              onClick={handleSubmit}
            >
              Update Collection Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
