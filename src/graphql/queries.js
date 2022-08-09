/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
      id
      title
      organizer {
        id
        username
        email
        avatar
        score
        createdAt
        updatedAt
      }
      type
      place
      description
      actGuests
      maxGuests
      likes
      latitude
      longitude
      year
      month
      day
      hour
      minute
      createdAt
      updatedAt
      eventOrganizerId
    }
  }
`;
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        organizer {
          id
          username
          email
          avatar
          score
          createdAt
          updatedAt
        }
        type
        place
        description
        actGuests
        maxGuests
        likes
        latitude
        longitude
        year
        month
        day
        hour
        minute
        createdAt
        updatedAt
        eventOrganizerId
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      email
      avatar
      score
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        email
        avatar
        score
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
