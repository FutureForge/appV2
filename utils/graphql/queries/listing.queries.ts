import { gql } from "graphql-request";

/* -------------------------------------------------------------------------------------------------
 * allListingsQuery
 * -----------------------------------------------------------------------------------------------*/

export const allListingsQuery = gql`
  query AllListings {
    allListings {
      assetContract
      currency
      endTimestamp
      id
      listingCreator
      listingId
      pricePerToken
      quantity
      reserved
      startTimestamp
      status
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
 * completedListingsQuery
 * -----------------------------------------------------------------------------------------------*/

export const completedListingsQuery = gql`
  query CompletedListings {
    completedListings {
      assetContract
      currency
      endTimestamp
      id
      listingCreator
      listingId
      pricePerToken
      quantity
      reserved
      startTimestamp
      status
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
 * newListingsQuery
 * -----------------------------------------------------------------------------------------------*/

export const newListingsQuery = gql`
  query NewListings {
    newListings {
      assetContract
      currency
      endTimestamp
      id
      listingCreator
      listingId
      pricePerToken
      quantity
      reserved
      startTimestamp
      tokenId
      status
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
 * newSaleListingsQuery
 * -----------------------------------------------------------------------------------------------*/

export const newSaleListingsQuery = gql`
  query NewSaleListings {
    newSaleListings {
      assetContract
      buyer
      id
      listingCreator
      listingId
      tokenId
      quantityBought
      totalPricePaid
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
