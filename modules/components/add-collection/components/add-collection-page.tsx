import {
  Button,
  FileInput,
  Label,
  ScrollArea,
  TextArea,
  TextField,
} from "@/modules/app";
import React, { useState } from "react";
// icons
import DownloadIcon from "@/assets/download.svg";
import X from "@/assets/logo-x-twitter.svg";
import Discord from "@/assets/discord.svg";
import Telegram from "@/assets/telegram.svg";

export function AddCollectionsPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const [telegram, setTelegram] = useState("");

  const isDisabled = !name || !description || !contractAddress;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h4 className="font-medium text-[28px]">Add Collections</h4>
        <p className="text-muted-foreground">
          Make sure you’re the owner of the collection
        </p>
      </div>
      <div className="flex items-center justify-center gap-7">
        <div className="flex flex-col gap-4">
          <div className="border-dashed border relative border-primary p-4 max-[1450px]:h-[230px] flex items-center justify-center w-[504px] rounded-3xl">
            <FileInput
              subTitle="Upload Image"
              icon={<DownloadIcon className="size-10" />}
            />
            <div className="bg-gradient-to-t from-black/50 to-transparent w-full absolute -bottom-2 left-0 right-0 h-40" />
          </div>
          <div className="border-dashed border relative border-primary p-4 max-[1450px]:h-[230px] flex items-center justify-center w-[504px] rounded-3xl">
            <FileInput
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
                    value={name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setName(event.target.value)
                    }
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
                    value={description}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setDescription(event.target.value)
                    }
                    id="description"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="traits">Contract Address</Label>
                    <TextField
                      value={contractAddress}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setContractAddress(event.target.value)
                      }
                      type="text"
                      id="name"
                      placeholder="Address"
                      containerClass="bg-border border-0"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <TextField
                      value={twitter}
                      icon={
                        <span className="bg-tertiary size-7 rounded-lg min-w-7 flex items-center justify-center">
                          <X />
                        </span>
                      }
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setTwitter(event.target.value)
                      }
                      type="text"
                      id="name"
                      placeholder="Add url"
                      containerClass="px-2 bg-border border-0"
                    />
                    <TextField
                      value={discord}
                      icon={
                        <span className="bg-tertiary size-7 rounded-lg min-w-7 flex items-center justify-center">
                          <Discord />
                        </span>
                      }
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setDiscord(event.target.value)
                      }
                      type="text"
                      id="name"
                      placeholder="Add url"
                      containerClass="px-2 bg-border border-0"
                    />
                    <TextField
                      value={telegram}
                      icon={
                        <span className="bg-tertiary size-7 rounded-lg min-w-7 flex items-center justify-center">
                          <Telegram />
                        </span>
                      }
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setTelegram(event.target.value)
                      }
                      type="text"
                      id="name"
                      placeholder="Add url"
                      containerClass="px-2 bg-border border-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="mt-4 flex items-center justify-end gap-3">
            <Button disabled={isDisabled} shape="square" className="w-full">
              Create NFT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
