export const queryKeys = {
  listing: {
    all: ["listing", "all"] as const,
    completed: ["completed"] as const,
    new: ["new"] as const,
    newSale: ["newSale"] as const,
  },
  auction: {
    all: ["auction", "all"] as const,
    completed: ["completed"] as const,
    new: ["new"] as const,
    closed: ["closed"] as const,
  },
  offers: {
    all: ["offers", "all"] as const,
    completed: ["completed"] as const,
    accepted: ["accepted"] as const,
    new: ["new"] as const,
  },
};
