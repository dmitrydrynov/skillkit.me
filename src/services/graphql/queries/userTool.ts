export const userToolsQuery = `
query($userSkillId: ID!) {
  userTools(where: { userSkillId: { equals: $userSkillId } } ) {
    id
    workTool {
      id
      name
    }
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
    workTool {
      id
      name
    }
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
    workTool {
      id
      name
    }
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
