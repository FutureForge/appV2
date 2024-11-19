import { gql } from "graphql-request";

/* -------------------------------------------------------------------------------------------------
 * allListingsQuery
 * -----------------------------------------------------------------------------------------------*/

export const allNFTsQuery = gql`
  query AllNFTs {
    nfts {
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
      #   owner
      tokenId
      tokenURI
      type
    }
  }
`;
