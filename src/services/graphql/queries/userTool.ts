export const updateUserToolsMutation = `
mutation ($data: [UserToolUpdateArgs!]!) {
  updateUserTools(data: $data) {
    id
  }
}
`;

export const deleteUserToolMutation = `
mutation ($where: UserToolWhereUniqueInput!) {
  deleteUserTool(where: $where) {
    id
  }
}
`;
