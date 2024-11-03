import { gql } from "graphql-request";

/* -------------------------------------------------------------------------------------------------
 * allAuctionsQuery
 * -----------------------------------------------------------------------------------------------*/

export const allAuctionsQuery = gql`
  query AllAuctions {
    allAuctions(orderBy: auctionId_DESC, limit: 50) {
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
    }
  }
`;

/* -------------------------------------------------------------------------------------------------
 * newAuctionsQuery
 * -----------------------------------------------------------------------------------------------*/

export const newAuctionsQuery = gql`
  query NewAuctions {
    newAuctions(orderBy: auctionId_DESC, limit: 50) {
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
  query AuctionClosed {
    auctionCloseds(orderBy: auctionId_DESC, limit: 50) {
      assetContract
      auctionCreator
      auctionId
      closer
      id
      tokenId
      transactionHash
      winningBidder
      # nft {
      #   assetContract
      #   id
      #   metadata {
      #     animationUrl
      #     attributes {
      #       traitType
      #       value
      #     }
      #     backgroundColor
      #     customAnimationUrl
      #     customImage
      #     description
      #     externalUrl
      #     image
      #     imageUrl
      #     name
      #     properties {
      #       name
      #       value
      #     }
      #     supply
      #   }
      #   owner
      #   tokenId
      #   tokenURI
      #   type
      # }
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
        }
      }
    ) {
      assetContract
      auctionCreator
      auctionId
      closer
      id
      tokenId
      transactionHash
      winningBidder
      # nft {
      #   assetContract
      #   id
      #   metadata {
      #     animationUrl
      #     attributes {
      #       traitType
      #       value
      #     }
      #     backgroundColor
      #     customAnimationUrl
      #     customImage
      #     description
      #     externalUrl
      #     image
      #     imageUrl
      #     name
      #     properties {
      #       name
      #       value
      #     }
      #     supply
      #   }
      #   owner
      #   tokenId
      #   tokenURI
      #   type
      # }
    }
  }
`;
