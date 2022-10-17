export const userSchoolsQuery = `
query($userSkillId: ID!) {
  userSchools(where: { userSkillId: { equals: $userSkillId } }, orderBy: {startedAt: desc, finishedAt: desc} ) {
    id
    school {
      id
      name
    }
    description
    startedAt
    finishedAt
  }
}
`;

export const getUserSchoolQuery = `
query($id: ID!) {
  userSchool(
    where: {
      id: $id
    }
  ) {
    id
    school {
      id
      name
    }
    description
    startedAt
    finishedAt
  }
}
`;

export const createUserSchoolMutation = `
mutation(
  $data: UserSchoolCreateInput!
) {
  createUserSchool(
    data: $data
  ) {
    id
    school {
      id
      name
    }
  }
}
`;

export const updateUserSchoolMutation = `
mutation(
  $recordId: ID!
  $data: UserSchoolUpdateInput!
) {
  updateUserSchool(
    where: {
      id: $recordId
    }
    data: $data
  ) { id }
}
`;

export const deleteUserSchoolMutation = `
mutation ($where: WhereUniqueInput!) {
  deleteUserSchool(where: $where)
}
`;
