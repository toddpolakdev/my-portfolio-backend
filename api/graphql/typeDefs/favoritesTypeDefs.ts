import { gql } from "apollo-server-micro";

export const favoritesTypeDefs = gql`
  type Favorite {
    id: ID!
    videoId: String!
    videoUrl: String!
    createdAt: String
  }

  type Query {
    myFavorites: [Favorite!]!
    isFavorite(videoId: String!): Boolean!
  }

  type Mutation {
    addFavorite(videoId: String!, videoUrl: String!): Favorite!
    removeFavorite(videoId: String!): Boolean!
  }
`;
