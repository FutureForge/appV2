import { gql } from "graphql-request";

/* -------------------------------------------------------------------------------------------------
 * allListingsQuery
 * -----------------------------------------------------------------------------------------------*/

export const allListingsQuery = gql`
  query AllListings {
    allListings(orderBy: listingId_DESC, limit: 50) {
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

export const filteredAllListingsQuery = gql`
  query FilteredAllListings(
    $contractAddress: String!
    $address: String!
  ) {
    allListings(
      where: {
        OR: {
          assetContract_eq: $contractAddress
          OR: { listingCreator_eq: $address }
        }
      }
    ) {
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
    completedListings(orderBy: listingId_DESC, limit: 50) {
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

export const filteredCompletedListingsQuery = gql`
  query FilteredCompletedListings(
    $contractAddress: String!
    $address: String!
  ) {
    completedListings(
      where: {
        OR: {
          assetContract_eq: $contractAddress
          OR: { listingCreator_eq: $address }
        }
      }
    ) {
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
    newListings(orderBy: listingId_DESC, limit: 50) {
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

export const filteredNewListingsQuery = gql`
  query FilteredNewListings(
    $contractAddress: String!
    $address: String!
  ) {
    newListings(
      where: {
        OR: {
          assetContract_eq: $contractAddress
          OR: { listingCreator_eq: $address }
        }
      }
    ) {
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
    newSaleListings(orderBy: listingId_DESC, limit: 50) {
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

export const filteredNewSaleListingsQuery = gql`
  query FilteredNewSaleListings(
    $contractAddress: String!
    $address: String!
  ) {
    newSaleListings(
      where: {
        OR: {
          assetContract_eq: $contractAddress
          OR: { listingCreator_eq: $address }
        }
      }
    ) {
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
