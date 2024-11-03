import { gql } from "graphql-request";

/* -------------------------------------------------------------------------------------------------
 * allOffersQuery
 * -----------------------------------------------------------------------------------------------*/

export const allOffersQuery = gql`
  query AllOffers($limit: Int!) {
    allOffers(orderBy: offerId_DESC, limit: $limit) {
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

export const singleOfferQuery = gql`
  query SingleOffer($contractAddress: String!, $tokenId: BigInt!) {
    allOffers(
      where: { assetContract_eq: $contractAddress, tokenId_eq: $tokenId }
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
  query AcceptedOffers($limit: Int!) {
    acceptedOffers(orderBy: offerId_DESC, limit: $limit) {
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
  query CompletedOffers($limit: Int!) {
    completedOffers(orderBy: offerId_DESC, limit: $limit) {
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
  query NewOffers($limit: Int!) {
    newOffers(orderBy: offerId_DESC, limit: $limit) {
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
