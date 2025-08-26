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

  type EducationEntry {
    degree: String!
    institution: String!
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
    education: [EducationEntry]
    background: String
  }

  type ContactEntry {
    _id: ID!
    name: String!
    email: String!
    subject: String!
    message: String!
    createdAt: String!
  }

  extend type Mutation {
    submitContact(
      name: String!
      email: String!
      subject: String!
      message: String!
    ): ContactEntry!
  }

  type Query {
    sections(ids: [String!]): [Section!]!
    section(id: String!): Section
  }

  type Mutation {
    submitContact(
      name: String!
      email: String!
      subject: String!
      message: String!
    ): ContactEntry!
  }
`;
