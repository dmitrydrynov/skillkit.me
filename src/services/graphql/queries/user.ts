export const getProfileQuery = `{
  getProfile {
    email
    firstName
    lastName
    country
    verificationLevel
    hasOneTimePassword
  }
}`;

export const setPasswordMutation = `
mutation setPassword($newPassword: String, $confirmPassword: String) {
  setPassword(newPassword: $newPassword, confirmPassword: $confirmPassword) {
      result
  }
}`;

export const deleteUserMutation = `
mutation deleteUser {
  deleteUser {
      result
  }
}`;

export const registerMutation = `
mutation(
  $firstName: String!,
  $lastName: String!,
  $email: String!
) {
  register(
    firstName: $firstName
    lastName: $lastName
    email: $email
  ) {
      ...on RegisterSuccess {
        ok
      }
      ...on RegisterFailure {
        code
        message
      }
  }
}`;

export const createUserMutation = `
mutation(
  $firstName: String!,
  $lastName: String!,
  $email: String!,
  $password: String!
) {
  createUser(data: {
    firstName: $firstName
    lastName: $lastName
    email: $email
    password: $password
  }) {
    id
  }
}`;

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