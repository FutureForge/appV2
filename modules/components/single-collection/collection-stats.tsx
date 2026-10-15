import XFI from "@/assets/xfi.svg";

interface CollectionDetailsProps {
  details: any;
}

export const CollectionDetails = ({ details }: CollectionDetailsProps) => {
  const labels = {
    floorPrice: "Floor Price",
    holderCount: "Holders",
    totalNFTs: "Collection Size",
    percentageOfAuctioned: "Auction %",
    percentageOfListed: "Listed %",
    totalVolume: "Total Volume",
  };

  const displayOrder = [
    "floorPrice",
    "totalVolume",
    "holderCount",
    "totalNFTs",
    "percentageOfAuctioned",
    "percentageOfListed",
  ];

  if (!details) {
    return (
      <div className="flex justify-end w-full">
        <p>No collection details available</p>
      </div>
    );
  }

  return (
    <>
      {displayOrder.map((key) => {
        const value = details[key as keyof typeof details];
        const label = labels[key as keyof typeof labels];
        const symbol = "BOT";

        const displayValue =
          value === undefined || value === Infinity ? 0 : value;
        const shouldShowSymbol = key === "floorPrice" || key === "totalVolume";

        return (
          <div key={key}>
            {shouldShowSymbol ? (
              <div className="flex items-center gap-2">
                <XFI className="size-4" />
                {displayValue || 0} {symbol}
              </div>
            ) : (
              displayValue || 0
            )}
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        );
      })}
    </>
  );
};
