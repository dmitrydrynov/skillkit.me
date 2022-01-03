export const signInMutation = `
mutation ($email: String!, $password: String) {
  signIn(email: $email, password: $password) {
    ... on AuthNextResponse {
      next
    }
    ... on AuthTokenResponse {
      token
      user {
        id
        firstName
        lastName
        fullName
        email
      }
    }
  }
}`;

export const authenticatedUserQuery = `
query {
  authenticatedUser {
    id
    firstName
    lastName
    fullName
    email
  }
}
`;

export const signInByCodeQuery = `
query($code: String!, $state: String) {
  signInByCode(code: $code, state: $state) {
    token
    user {
      id
      firstName
      lastName
      fullName
      email
    }
  }
}
`;

export const endSessionMutation = `
  mutation {
    endSession
  }
`;

export const sendUserMagicAuthLinkMutation = `
  mutation($email: String!) {
    sendUserMagicAuthLink(
        email: $email
      ) {
      code
      message
    }
  }
`;

export const redeemUserMagicAuthTokenMutation = `
mutation($email: String!, $token: String!) {
  redeemUserMagicAuthToken(email: $email, token: $token) {
    ...on RedeemUserMagicAuthTokenSuccess {
      token
      item {
        id
        name
      }
    }

    ...on RedeemUserMagicAuthTokenFailure {
      errorMessage: message
    }
  }
}
`;
