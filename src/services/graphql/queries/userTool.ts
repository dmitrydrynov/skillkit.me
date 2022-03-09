export const createUserToolMutation = `
mutation(
  $data: UserToolInput!
) {
  createUserTool(
    data: $data
  ) {
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
