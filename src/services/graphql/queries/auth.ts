export const authorizeMutation = `mutation ($email: String!, $password: String!) {
  authenticateUserWithPassword(email: $email, password: $password) {
    ...on UserAuthenticationWithPasswordSuccess {
      sessionToken
      item {
        name
        email
        id
        role {
          id
          name
          canManageUsers
        }
      }
    }
    ...on UserAuthenticationWithPasswordFailure {
      errorMessage: message
    }
  }
}`;

export const authenticatedUserQuery = `
  {
    authenticatedItem {
      ...on User {
        id
        name
        email
        avatar {
          url
        }
        role {
          name
          canManageUsers
        }
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
