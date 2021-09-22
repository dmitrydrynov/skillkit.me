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

export const signUpMutation = `
mutation(
  $firstName: String!,
  $lastName: String!,
  $email: String!
) {
  signUp(
    firstName: $firstName
    lastName: $lastName
    email: $email
  ) {
    ...on SignUpSuccess {
      ok
    }
    ...on SignUpFailure {
      code
      message
    }
  }
}`;

export const authorizeMutation = `
mutation(
  $tempPassword: String!,
  $email: String!
) {
  signUp(
    tempPassword: $tempPassword
    email: $email
  ) {
    ...on SignUpSuccess {
      ok
    }
    ...on SignUpFailure {
      code
      message
    }
  }
}`;