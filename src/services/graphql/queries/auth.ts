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

export const resetPasswordMutation = `
  mutation($email: String!, $token: String!, $password: String!) {
    redeemUserPasswordResetToken(
        email: $email
        token: $token
        password: $password
      ) {
      code
      message
    }
  }
`;

export const forgotPasswordMutation = `
mutation($email: String!) {
  sendUserPasswordResetLink(email: $email) {
    code
    message
  }
}
`;