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
query ($id: ID) {
  user(where: {
    id: $id
  }) {
    firstName
    lastName
    email
    country
    birthdayDate
    avatar {
      src
    }
  }
}
`;

export const updateUserMutation = `
mutation(
  $id: ID
  $firstName: String!
  $lastName: String!
  $email: String!
  $country: String!
  $birthdayDate: String!
  $avatar: ImageFieldInput
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
    }
  ) {
    id
  }
}`;

export const changeUserPasswordMutation = `
mutation(
  $id: ID
  $password: String!
) {
  updateUser(
    where: {id: $id}
    data: {
      password: $password
    }
  ) {
    id
  }
}`;