export const updateUserToolsMutation = `
mutation ($data: [UserToolUpdateArgs!]!) {
  updateUserTools(data: $data) {
    id
  }
}
`;
