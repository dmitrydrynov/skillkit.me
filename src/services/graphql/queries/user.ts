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
  $password: String!, 
  $confirmPassword: String!, 
  $email: String!
) {
  register(
    firstName: $firstName
    lastName: $lastName
    password: $password
    confirmPassword: $confirmPassword
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

export const sendConfirmCodeMutation = `
mutation(
  $email: String!
) {
  sendConfirmCode(
    email: $email
  ) {
      success
  }
}`;