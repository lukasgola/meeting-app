/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent {
    onCreateEvent {
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
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent {
    onUpdateEvent {
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
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent {
    onDeleteEvent {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
