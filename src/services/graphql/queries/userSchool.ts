export const updateUserSchoolsMutation = `
mutation ($data: [UserSchoolUpdateArgs!]!) {
  updateUserSchools(data: $data) {
    id
  }
}
`;

export const deleteUserSchoolMutation = `
mutation ($where: UserSchoolWhereUniqueInput!) {
  deleteUserSchool(where: $where) {
    id
  }
}
`;
