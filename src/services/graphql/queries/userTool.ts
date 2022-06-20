export const userToolsQuery = `
query($userSkillId: ID!) {
  userTools(where: { userSkillId: { equals: $userSkillId } } ) {
    id
    title
    description
  }
}
`;

export const getUserToolQuery = `
query($id: ID!) {
  userTool(
    where: {
      id: $id
    }
  ) {
    id
    title
    description
  }
}
`;

export const createUserToolMutation = `
mutation(
  $data: UserToolCreateInput!
) {
  createUserTool(
    data: $data
  ) {
    id
    title
  }
}
`;

export const updateUserToolMutation = `
mutation(
  $recordId: ID!
  $data: UserToolUpdateInput!
) {
  updateUserTool(
    where: {
      id: $recordId
    }
    data: $data
  ) { id }
}
`;

export const deleteUserToolMutation = `
mutation ($where: WhereUniqueInput!) {
  deleteUserTool(where: $where)
}
`;
