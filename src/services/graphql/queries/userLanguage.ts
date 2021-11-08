export const updateUserJobsMutation = `
mutation ($data: [UserJobUpdateArgs!]!) {
  updateUserJobs(data: $data) {
    id
  }
}
`;

export const deleteUserJobMutation = `
mutation ($where: UserJobWhereUniqueInput!) {
  deleteUserJob(where: $where) {
    id
  }
}
`;
