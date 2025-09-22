import { gql } from "apollo-server-micro";

export const flipbookTypeDefs = gql`
  type FlipBook {
    id: ID!
    slug: String!
    title: String!
    description: String
    images: [String!]!
    status: String!
    tags: [String!]!
    order: Int
    settings: FlipBookSettings
    publishedAt: String
    createdAt: String
    updatedAt: String
  }

  type FlipBookSettings {
    width: Int
    height: Int
    size: String
    minWidth: Int
    maxWidth: Int
    minHeight: Int
    maxHeight: Int
    drawShadow: Boolean
    flippingTime: Int
    usePortrait: Boolean
    startZIndex: Int
    autoSize: Boolean
    maxShadowOpacity: Float
    showCover: Boolean
    mobileScrollSupport: Boolean
    backgroundColor: String
    showPageNumbers: Boolean
    swipeDistance: Int
    showPageCorners: Boolean
    disableFlipByClick: Boolean
    useMouseEvents: Boolean
  }

  input FlipBookInput {
    slug: String!
    title: String!
    description: String
    images: [String!]!
    status: String!
    tags: [String!]!
    settings: FlipBookSettingsInput
  }

  input FlipBookSettingsInput {
    width: Int
    height: Int
    size: String
    minWidth: Int
    maxWidth: Int
    minHeight: Int
    maxHeight: Int
    drawShadow: Boolean
    flippingTime: Int
    usePortrait: Boolean
    startZIndex: Int
    autoSize: Boolean
    maxShadowOpacity: Float
    showCover: Boolean
    mobileScrollSupport: Boolean
    backgroundColor: String
    showPageNumbers: Boolean
    swipeDistance: Int
    showPageCorners: Boolean
    disableFlipByClick: Boolean
    useMouseEvents: Boolean
  }

  type Query {
    flipBooks: [FlipBook!]!
    flipBookBySlug(slug: String!): FlipBook
    myFlipbooks: [FlipBook!]!
  }

  type Mutation {
    createFlipBook(input: FlipBookInput!): ID!
    updateFlipBook(id: ID!, input: FlipBookInput!): Boolean!
    reorderFlipBooks(ids: [ID!]!): Boolean!
  }
`;
