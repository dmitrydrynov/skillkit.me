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

export const transactionsListQuery = `
query transactionsList($limit: Int, $offset: Int, $where: SequelizeJSON, $order: String) {
  transactionsList(limit: $limit, offset: $offset, where: $where, order: $order) {
    total
    items {
      id
      hash
      status
      cryptoCurrencyAmount
      fiatCurrencyAmount
      frozenState
      createdAt
      updatedAt
      walletAddress
      cryptoCurrency {
        name
        code
      }
      fiatCurrency {
        name
        code
      }
    }
  }
}`;

export const walletsListQuery = `{
  userWallets {
      items {
          id
          address
          name
          cryptoCurrency {
            id
            code
          }
      }
  }
}`;

export const cardsListQuery = `{
  userCards {
      items {
          id
          number
          holder
          expire
          asMain
      }
  }
}`;
