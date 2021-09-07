export const authorizeMutation = `mutation ($email: String!, $password: String!) {
  authenticateUserWithPassword(email: $email, password: $password) {
    ...on UserAuthenticationWithPasswordSuccess {
      sessionToken
      item {
        name
      }
    }
    ...on UserAuthenticationWithPasswordFailure {
      code
      message
    }
  }
}`;