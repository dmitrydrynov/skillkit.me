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

export const userDataQuery = `
query ($id: Float!) {
  user(where: {
    id: $id
  }) {
    firstName
    lastName
    email
    country
    birthdayDate
    avatar
    about
  }
}
`;

export const updateUserMutation = `
mutation(
  $id: Float!
  $firstName: String!
  $lastName: String!
  $email: String!
  $country: String!
  $birthdayDate: DateTime!
  $avatar: String
  $about: String
) {
  updateUser(
    where: {id: $id}
    data: {
      firstName: $firstName
      lastName: $lastName
      email: $email
      country: $country
      birthdayDate: $birthdayDate
      avatar: $avatar
      about: $about
    }
  ) {
    firstName
    lastName
    email
    country
    birthdayDate
    avatar
    about
  }
}`;

export const changeUserPasswordMutation = `
mutation(
  $useOTP: Boolean!
  $oldPassword: String
  $newPassword: String
  $confirmPassword: String
) {
  changeUserPassword(
    useOTP: $useOTP
    oldPassword: $oldPassword
    newPassword: $newPassword
    confirmPassword: $confirmPassword
  )
}`;
