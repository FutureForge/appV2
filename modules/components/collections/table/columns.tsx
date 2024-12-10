"use client";
import { createColumnHelper } from "@tanstack/react-table";
import { ColumnHeader } from "@/modules/app/component/table/header";
import { Collection } from "@/utils/types/collection/collection.type";
import XFI from "@/assets/xfi.svg";

export function makeCollectionColumns() {
  const columns = createColumnHelper<Collection>();

  /* -------------------------------------------------------------------------------------------------
   * Collection column
   * -----------------------------------------------------------------------------------------------*/
  const collectionColumn = columns.accessor("collectionName", {
    header: ({ column }) => (
      <div className="flex items-center gap-3 min-w-[193px]">
        <div className="text-center min-w-[30px] text-muted-foreground">#</div>{" "}
        <ColumnHeader column={column}>Collection</ColumnHeader>
      </div>
    ),
    cell: ({ row, getValue }) => {
      const { collectionName, collectionImage } = row.original;
      return (
        <div className="flex items-center gap-3 w-full">
          <div className="text-center min-w-[30px]">{row.index + 1}</div>
          <div className="flex items-center">
            <img
              src={collectionImage}
              alt={getValue()}
              className="mr-3 size-10 rounded-xl"
            />
            <div className="flex flex-col gap-1.5">
              <div className="text-sm">
                <span>
                  {collectionName}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    },
  });

  /* -------------------------------------------------------------------------------------------------
   * Floor Price column
   * -----------------------------------------------------------------------------------------------*/
   const FLOORPRICE_HEADER_NAME = "Floor Price";
  const floorPriceColumn = columns.accessor("floorPrice", {
    header: ({ column }) => (
      <div className="min-w-[120px]">
        <ColumnHeader column={column}>{FLOORPRICE_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div className="flex gap-2 items-center">
        <XFI className="size-6" />
        <p>{getValue()} XFI</p>
      </div>
    ),
    meta: { headerName: FLOORPRICE_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Volume column
   * -----------------------------------------------------------------------------------------------*/
  const VOLUME_HEADER_NAME = "Volume";
  const volumeColumn = columns.accessor("totalVolume", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>{VOLUME_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div>
        <p>{getValue()} XFI</p>
      </div>
    ),
    meta: { headerName: VOLUME_HEADER_NAME },
  });

  /* -------------------------------------------------------------------------------------------------
   * Holder Count column
   * -----------------------------------------------------------------------------------------------*/
  const HOLDERCOUNT_HEADER_NAME = "Holder Count";
  const holderCountColumn = columns.accessor("holderCount", {
    header: ({ column }) => (
      <div className="flex min-w-[120px]">
        <ColumnHeader column={column}>{HOLDERCOUNT_HEADER_NAME}</ColumnHeader>
      </div>
    ),
    cell: ({ getValue }) => (
      <div>
        <p>{getValue()}</p>
      </div>
    ),
    meta: { headerName: HOLDERCOUNT_HEADER_NAME },
  });

  return [collectionColumn, floorPriceColumn, volumeColumn, holderCountColumn];
}
