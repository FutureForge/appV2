import { gql } from "graphql-request";

/* -------------------------------------------------------------------------------------------------
 * allOffersQuery
 * -----------------------------------------------------------------------------------------------*/

export const allOffersQuery = gql`
  query AllOffers {
    allOffers(orderBy: offerId_DESC, limit: 50) {
      assetContract
      currency
      expirationTimestamp
      id
      offerId
      offeror
      quantity
      status
      tokenId
      tokenType
      totalPrice
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

export const filteredAllOffersQuery = gql`
  query FilteredAllOffers($contractAddress: String!, $address: String!) {
    allOffers(
      where: {
        OR: { assetContract_eq: $contractAddress, OR: { offeror_eq: $address } }
      }
    ) {
      assetContract
      currency
      expirationTimestamp
      id
      offerId
      offeror
      quantity
      status
      tokenId
      tokenType
      totalPrice
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
 * acceptedOffersQuery
 * -----------------------------------------------------------------------------------------------*/

export const acceptedOffersQuery = gql`
  query AcceptedOffers {
    acceptedOffers(orderBy: offerId_DESC, limit: 50) {
      assetContract
      id
      offerId
      offeror
      quantityBought
      seller
      tokenId
      totalPricePaid
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

export const filteredAcceptedOffersQuery = gql`
  query FilteredAcceptedOffers($contractAddress: String!, $address: String!) {
    acceptedOffers(
      where: {
        OR: { assetContract_eq: $contractAddress, OR: { offeror_eq: $address } }
      }
    ) {
      assetContract
      id
      offerId
      offeror
      quantityBought
      seller
      tokenId
      totalPricePaid
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
 * completedOffersQuery
 * -----------------------------------------------------------------------------------------------*/

export const completedOffersQuery = gql`
  query CompletedOffers {
    completedOffers(orderBy: offerId_DESC, limit: 50) {
      assetContract
      currency
      expirationTimestamp
      id
      offerId
      offeror
      quantity
      status
      tokenId
      tokenType
      totalPrice
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

export const filteredCompletedOffersQuery = gql`
  query FilteredCompletedOffers($contractAddress: String!, $address: String!) {
    completedOffers(
      where: {
        OR: { assetContract_eq: $contractAddress, OR: { offeror_eq: $address } }
      }
    ) {
      assetContract
      currency
      expirationTimestamp
      id
      offerId
      offeror
      quantity
      status
      tokenId
      tokenType
      totalPrice
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
 * newOffersQuery
 * -----------------------------------------------------------------------------------------------*/

export const newOffersQuery = gql`
  query NewOffers {
    newOffers(orderBy: offerId_DESC, limit: 50) {
      assetContract
      currency
      expirationTimestamp
      id
      offerId
      offeror
      quantity
      status
      tokenId
      tokenType
      totalPrice
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

export const filteredNewOffersQuery = gql`
  query FilteredNewOffers($contractAddress: String!, $address: String!) {
    newOffers(
      where: {
        OR: { assetContract_eq: $contractAddress, OR: { offeror_eq: $address } }
      }
    ) {
      assetContract
      currency
      expirationTimestamp
      id
      offerId
      offeror
      quantity
      status
      tokenId
      tokenType
      totalPrice
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
