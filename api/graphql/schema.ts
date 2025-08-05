import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type SkillCategory {
    category: String!
    tags: [String!]!
  }

  type JobEntry {
    title: String!
    company: String!
    duration: String!
    description: [String!]!
  }

  type Section {
    _id: ID!
    id: String!
    title: String!
    type: String!
    subtitle: String
    description: String
    content: [String]
    skills: [SkillCategory]
    experience: [JobEntry]
    background: String
  }

  type Query {
    sections(ids: [String!]): [Section!]!
    section(id: String!): Section
  }
`;
