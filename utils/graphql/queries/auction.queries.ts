import { gql } from "graphql-request";

/* -------------------------------------------------------------------------------------------------
 * allAuctionsQuery
 * -----------------------------------------------------------------------------------------------*/

export const allAuctionsQuery = gql`
  query AllAuctions($limit: Int!) {
    allAuctions(orderBy: auctionId_DESC, limit: $limit) {
      assetContract
      auctionCreator
      auctionId
      bidBufferBps
      buyoutBidAmount
      currency
      endTimestamp
      id
      isAuctionExpired
      minimumBidAmount
      quantity
      startTimestamp
      status
      timeBufferInSeconds
      tokenId
      tokenType
      nft {
        assetContract
        id
        metadata {
          animationUrl
          attributes {
            traitType
            value
          }
          backgroundColor
          customAnimationUrl
          customImage
          description
          externalUrl
          image
          imageUrl
          name
          properties {
            name
            value
          }
          supply
        }
        owner
        tokenId
        tokenURI
        type
      }
      winningBid {
        bidAmount
        bidder
        currency
      }
    }
  }
`;

export const filteredAllAuctionsQuery = gql`
  query FilteredAllAuctions($contractAddress: String!, $address: String!) {
    allAuctions(
      where: {
        OR: {
          assetContract_eq: $contractAddress
          OR: { auctionCreator_eq: $address }
        }
      }
    ) {
      assetContract
      auctionCreator
      auctionId
      bidBufferBps
      buyoutBidAmount
      currency
      endTimestamp
      id
      isAuctionExpired
      minimumBidAmount
      quantity
      startTimestamp
      status
      timeBufferInSeconds
      tokenId
      tokenType
      nft {
        assetContract
        id
        metadata {
          animationUrl
          attributes {
            traitType
            value
          }
          backgroundColor
          customAnimationUrl
          customImage
          description
          externalUrl
          image
          imageUrl
          name
          properties {
            name
            value
          }
          supply
        }
        owner
        tokenId
        tokenURI
        type
      }
      winningBid {
        bidAmount
        bidder
        currency
      }
    }
  }
`;

export const singleAuctionQuery = gql`
  query SingleAuction($contractAddress: String!, $tokenId: BigInt!) {
    allAuctions(
      where: { assetContract_eq: $contractAddress, tokenId_eq: $tokenId }
    ) {
      assetContract
      auctionCreator
      auctionId
      bidBufferBps
      buyoutBidAmount
      currency
      endTimestamp
      id
      isAuctionExpired
      minimumBidAmount
      quantity
      startTimestamp
      status
      timeBufferInSeconds
      tokenId
      tokenType
      nft {
        assetContract
        id
        metadata {
          animationUrl
          attributes {
            traitType
            value
          }
          backgroundColor
          customAnimationUrl
          customImage
          description
          externalUrl
          image
          imageUrl
          name
          properties {
            name
            value
          }
          supply
        }
        owner
        tokenId
        tokenURI
        type
      }
      winningBid {
        bidAmount
        bidder
        currency
      }
    }
  }
`;

/* -------------------------------------------------------------------------------------------------
 * completedAuctionsQuery
 * -----------------------------------------------------------------------------------------------*/

export const completedAuctionsQuery = gql`
  query CompletedAuctions {
    completedAuctions(orderBy: auctionId_DESC, limit: 50) {
      assetContract
      auctionCreator
      auctionId
      bidBufferBps
      buyoutBidAmount
      currency
      endTimestamp
      id
      isAuctionExpired
      minimumBidAmount
      quantity
      startTimestamp
      status
      timeBufferInSeconds
      tokenId
      tokenType
      nft {
        assetContract
        id
        metadata {
          animationUrl
          attributes {
            traitType
            value
          }
          backgroundColor
          customAnimationUrl
          customImage
          description
          externalUrl
          image
          imageUrl
          name
          properties {
            name
            value
          }
          supply
        }
        owner
        tokenId
        tokenURI
        type
      }
      winningBid {
        bidAmount
        bidder
        currency
      }
    }
  }
`;

export const filteredCompletedAuctionsQuery = gql`
  query FilteredCompletedAuctions(
    $contractAddress: String!
    $address: String!
  ) {
    completedAuctions(
      where: {
        OR: {
          assetContract_eq: $contractAddress
          OR: { auctionCreator_eq: $address }
        }
      }
    ) {
      assetContract
      auctionCreator
      auctionId
      bidBufferBps
      buyoutBidAmount
      currency
      endTimestamp
      id
      isAuctionExpired
      minimumBidAmount
      quantity
      startTimestamp
      status
      timeBufferInSeconds
      tokenId
      tokenType
      nft {
        assetContract
        id
        metadata {
          animationUrl
          attributes {
            traitType
            value
          }
          backgroundColor
          customAnimationUrl
          customImage
          description
          externalUrl
          image
          imageUrl
          name
          properties {
            name
            value
          }
          supply
        }
        owner
        tokenId
        tokenURI
        type
      }
      winningBid {
        bidAmount
        bidder
        currency
      }
    }
  }
`;

/* -------------------------------------------------------------------------------------------------
 * newAuctionsQuery
 * -----------------------------------------------------------------------------------------------*/

export const newAuctionsQuery = gql`
  query NewAuctions($limit: Int!) {
    newAuctions(orderBy: auctionId_DESC, limit: $limit) {
      assetContract
      auctionCreator
      auctionId
      bidBufferBps
      buyoutBidAmount
      currency
      endTimestamp
      id
      minimumBidAmount
      quantity
      startTimestamp
      status
      timeBufferInSeconds
      tokenId
      tokenType
      transactionHash
      nft {
        assetContract
        id
        metadata {
          animationUrl
          attributes {
            traitType
            value
          }
          backgroundColor
          customAnimationUrl
          customImage
          description
          externalUrl
          image
          imageUrl
          name
          properties {
            name
            value
          }
          supply
        }
        owner
        tokenId
        tokenURI
        type
      }
    }
  }
`;

export const filteredNewAuctionsQuery = gql`
  query FilteredNewAuctions($contractAddress: String!, $address: String!) {
    newAuctions(
      where: {
        OR: {
          assetContract_eq: $contractAddress
          OR: { auctionCreator_eq: $address }
        }
      }
    ) {
      assetContract
      auctionCreator
      auctionId
      bidBufferBps
      buyoutBidAmount
      currency
      endTimestamp
      id
      minimumBidAmount
      quantity
      startTimestamp
      status
      timeBufferInSeconds
      tokenId
      tokenType
      transactionHash
      nft {
        assetContract
        id
        metadata {
          animationUrl
          attributes {
            traitType
            value
          }
          backgroundColor
          customAnimationUrl
          customImage
          description
          externalUrl
          image
          imageUrl
          name
          properties {
            name
            value
          }
          supply
        }
        owner
        tokenId
        tokenURI
        type
      }
    }
  }
`;

/* -------------------------------------------------------------------------------------------------
 * auctionClosedQuery
 * -----------------------------------------------------------------------------------------------*/

export const auctionClosedQuery = gql`
  query AuctionClosed($limit: Int!) {
    auctionCloseds(
      orderBy: auctionId_DESC
      limit: $limit
      where: { auctionStatus_containsInsensitive: "claimed" }
    ) {
      assetContract
      auctionCreator
      auctionId
      auctionStatus
      bidAmount
      closer
      currency
      id
      tokenId
      transactionHash
      winningBidder
      nft {
        assetContract
        id
        metadata {
          animationUrl
          attributes {
            traitType
            value
          }
          backgroundColor
          customAnimationUrl
          customImage
          description
          externalUrl
          image
          imageUrl
          name
          properties {
            name
            value
          }
          supply
        }
        owner
        tokenId
        tokenURI
        type
      }
    }
  }
`;

export const filteredAuctionClosedQuery = gql`
  query FilteredAuctionClosed($contractAddress: String!, $address: String!) {
    auctionCloseds(
      where: {
        OR: {
          assetContract_eq: $contractAddress
          OR: { auctionCreator_eq: $address }
          AND: { auctionStatus_contains: "payout-claimed" }
        }
      }
    ) {
      assetContract
      auctionCreator
      auctionId
      auctionStatus
      bidAmount
      closer
      currency
      id
      tokenId
      transactionHash
      winningBidder
      nft {
        assetContract
        id
        metadata {
          animationUrl
          attributes {
            traitType
            value
          }
          backgroundColor
          customAnimationUrl
          customImage
          description
          externalUrl
          image
          imageUrl
          name
          properties {
            name
            value
          }
          supply
        }
        owner
        tokenId
        tokenURI
        type
      }
    }
  }
`;

//  auctionCloseds(where: {assetContract_eq: "0x1a35a38630b6f56637268f437493601dbf72e61a", AND: {tokenId_eq: "8", AND: {auctionStatus_eq: "payout-claimed"}}}) {

export const filteredAuctionPayoutClaimedQuery = gql`
  query FilteredAuctionPayoutClaimed(
    $contractAddress: String!
    $tokenId: BigInt!
  ) {
    auctionCloseds(
      where: {
        assetContract_eq: $contractAddress
        AND: {
          tokenId_eq: $tokenId
          AND: { auctionStatus_eq: "payout-claimed" }
        }
      }
    ) {
      assetContract
      auctionCreator
      auctionId
      auctionStatus
      bidAmount
      closer
      currency
      id
      tokenId
      transactionHash
      winningBidder
      nft {
        assetContract
        id
        metadata {
          animationUrl
          attributes {
            traitType
            value
          }
          backgroundColor
          customAnimationUrl
          customImage
          description
          externalUrl
          image
          imageUrl
          name
          properties {
            name
            value
          }
          supply
        }
        owner
        tokenId
        tokenURI
        type
      }
    }
  }
`;

/* -------------------------------------------------------------------------------------------------
 * auctionPendingPayoutQuery
 * -----------------------------------------------------------------------------------------------*/

export const filteredAuctionPendingPayoutQuery = gql`
  query FilteredAuctionPendingPayout(
    $contractAddress: String!
    $tokenId: BigInt!
  ) {
    auctionCloseds(
      where: {
        OR: {
          assetContract_eq: $contractAddress
          AND: {
            tokenId_eq: $tokenId
            AND: { auctionStatus_eq: "pending-payout-claim" }
          }
        }
      }
    ) {
      assetContract
      auctionCreator
      auctionId
      auctionStatus
      bidAmount
      closer
      currency
      id
      tokenId
      transactionHash
      winningBidder
      nft {
        assetContract
        id
        metadata {
          animationUrl
          attributes {
            traitType
            value
          }
          backgroundColor
          customAnimationUrl
          customImage
          description
          externalUrl
          image
          imageUrl
          name
          properties {
            name
            value
          }
          supply
        }
        owner
        tokenId
        tokenURI
        type
      }
    }
  }
`;

/* -------------------------------------------------------------------------------------------------
 * newBidsQuery
 * -----------------------------------------------------------------------------------------------*/

export const newBidsQuery = gql`
  query NewBids($limit: Int!) {
    newBids(orderBy: auctionId_DESC, limit: $limit) {
      assetContract
      auctionCreator
      auctionId
      bidAmount
      bidBufferBps
      bidder
      buyoutBidAmount
      currency
      endTimestamp
      id
      minimumBidAmount
      quantity
      startTimestamp
      status
      timeBufferInSeconds
      tokenId
      tokenType
      nft {
        assetContract
        id
        metadata {
          animationUrl
          attributes {
            traitType
            value
          }
          backgroundColor
          customAnimationUrl
          customImage
          description
          externalUrl
          image
          imageUrl
          name
          properties {
            name
            value
          }
          supply
        }
        owner
        tokenId
        tokenURI
        type
      }
    }
  }
`;

export const filteredUserNewBidsQuery = gql`
  query FilteredUserNewBids($address: String!) {
    newBids(where: { bidder_eq: $address }) {
      assetContract
      auctionCreator
      auctionId
      bidAmount
      bidBufferBps
      bidder
      buyoutBidAmount
      currency
      endTimestamp
      id
      minimumBidAmount
      quantity
      startTimestamp
      status
      timeBufferInSeconds
      tokenId
      tokenType
      nft {
        assetContract
        id
        metadata {
          animationUrl
          attributes {
            traitType
            value
          }
          backgroundColor
          customAnimationUrl
          customImage
          description
          externalUrl
          image
          imageUrl
          name
          properties {
            name
            value
          }
          supply
        }
        owner
        tokenId
        tokenURI
        type
      }
    }
  }
`;
