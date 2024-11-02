import { gql } from "graphql-request";

/* -------------------------------------------------------------------------------------------------
 * allOffersQuery
 * -----------------------------------------------------------------------------------------------*/

export const allOffersQuery = gql`
  query AllOffers {
    allOffers {
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
    acceptedOffers {
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
    completedOffers {
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
    newOffers {
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
