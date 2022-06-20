export const userExamplesQuery = `
query($userSkillId: ID!) {
  userExamples(where: { userSkillId: { equals: $userSkillId } }) {
    id
    title
    file
    description
  }
}
`;

export const getUserExampleQuery = `
query($id: ID!) {
  userExample(
    where: {
      id: $id
    }
  ) {
    id
    title
    file
    description
  }
}
`;

export const createUserExampleMutation = `
mutation(
  $data: UserExampleCreateInput!
) {
  createUserExample(
    data: $data
  ) {
    id
    title
  }
}
`;

export const updateUserExampleMutation = `
mutation(
  $recordId: ID!
  $data: UserExampleUpdateInput!
) {
  updateUserExample(
    where: {
      id: $recordId
    }
    data: $data
  ) { id }
}
`;

export const deleteUserExampleMutation = `
mutation ($where: WhereUniqueInput!) {
  deleteUserExample(where: $where)
}
`;
