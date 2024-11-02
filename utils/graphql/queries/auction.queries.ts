import { gql } from "graphql-request";

/* -------------------------------------------------------------------------------------------------
 * allAuctionsQuery
 * -----------------------------------------------------------------------------------------------*/

export const allAuctionsQuery = gql`
  query AllAuctions {
    allAuctions {
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
    completedAuctions {
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

export const newAuctionsQuery = gql`
  query NewAuctions {
    newAuctions {
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
