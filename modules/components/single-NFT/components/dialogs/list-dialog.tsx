import {
  Button,
  DialogBody,
  DialogHeader,
  DialogTitle,
  Label,
  TextField,
} from "@/modules/app";
import React, { useRef, useState } from "react";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/utils/configs";

import Calendar from "@/assets/calendar.svg";

type ListDialogProps = {
  src: string;
  alt: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  name: string;
  tokenId: string;
};

export function ListDialog({ src, alt, name, tokenId }: ListDialogProps) {
  const [value, setValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {name} - {tokenId}
        </DialogTitle>
      </DialogHeader>
      <DialogBody>
        <div className="flex w-full gap-6 items-start">
          <div className="relative w-1/2 h-[350px]">
            <div className="w-full relative h-full min-h-[350px] gradient-box z-40 rounded-2xl">
              <MediaRenderer
                src={src}
                client={client}
                alt={alt}
                className="object-cover w-full absolute inset-0 size-full"
              />
              <div className="w-full h-[257px] absolute bottom-0 left-0 right-0 bg-gradient-to-t rounded-2xl via-black/80 from-background to-transparent" />
            </div>
          </div>
          <div className="w-1/2 flex flex-col h-[350px]">
            <form className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label>Listing Price</Label>
                <TextField
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  containerClass="bg-transparent rounded-lg"
                  placeholder="Amount"
                />
              </div>

              <div className="flex flex-col gap-2 bg-gradient-to-r from-border to-transparent p-3 rounded-xl">
                <Label>Duration</Label>

                <span className="flex">
                  <TextField
                    icon={
                      <span className="min-w-[14px]">
                        {" "}
                        <Calendar
                          onClick={() => startDateRef.current?.showPicker()}
                        />
                      </span>
                    }
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    containerClass="bg-transparent rounded-lg"
                    //   placeholder="Amount"
                  />
                  <TextField
                    icon={
                      <Calendar
                        onClick={() => endDateRef.current?.showPicker()}
                      />
                    }
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    containerClass="bg-transparent rounded-lg"
                    //   placeholder="Amount"
                  />
                </span>
              </div>
            </form>

            <div className="flex w-full items-end justify-end mt-auto">
              <Button disabled={!value} className="w-full" shape="square">
                Make Offer
              </Button>
            </div>
          </div>
        </div>
      </DialogBody>
    </>
  );
}
