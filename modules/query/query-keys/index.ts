export const queryKeys = {
  listing: {
    all: ["listing"] as const,
    completed: ["completed-listings"] as const,
    new: ["new-listing"] as const,
    newSale: ["newSale-listings"] as const,
    single: ["single-listing"] as const,
  },
  auction: {
    all: ["auction"] as const,
    completed: ["completed-auctions"] as const,
    new: ["new-auction"] as const,
    closed: ["closed-auctions"] as const,
    single: ["single-auction"] as const,
    newBids: ["new-bids"] as const,
    newBidsUser: ["new-bids-user"] as const,
  },
  offers: {
    all: ["offers"] as const,
    completed: ["completed-offers"] as const,
    accepted: ["accepted-offers"] as const,
    new: ["new-offer"] as const,
    single: ["single-offer"] as const,
  },
  collection: {
    all: ["collection"] as const,
    single: ["single-collection"] as const,
  },
  nft: {
    single: ["single-nft"] as const,
  },
  user: {
    nfts: ["user-nfts"] as const,
    offers: ["user-offers"] as const,
    auctions: ["user-auctions"] as const,
    listings: ["user-listings"] as const,
    offersReceived: ["user-offers-received"] as const,
    expiredListings: ["user-expired-listings"] as const,
    expiredAuctions: ["user-expired-auctions"] as const,
    expiredOffers: ["user-expired-offers"] as const,
  },
};
