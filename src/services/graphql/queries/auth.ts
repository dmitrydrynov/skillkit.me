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
      code
      message
    }
  }
}`;

export const authenticatedUserQuery = `
  {
    authenticatedItem {
      ...on User {
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
  }
`;

export const endSessionMutation = `
  mutation {
    endSession
  }
`;