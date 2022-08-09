/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createEvent = /* GraphQL */ `
  mutation CreateEvent(
    $input: CreateEventInput!
    $condition: ModelEventConditionInput
  ) {
    createEvent(input: $input, condition: $condition) {
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
export const updateEvent = /* GraphQL */ `
  mutation UpdateEvent(
    $input: UpdateEventInput!
    $condition: ModelEventConditionInput
  ) {
    updateEvent(input: $input, condition: $condition) {
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
export const deleteEvent = /* GraphQL */ `
  mutation DeleteEvent(
    $input: DeleteEventInput!
    $condition: ModelEventConditionInput
  ) {
    deleteEvent(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
