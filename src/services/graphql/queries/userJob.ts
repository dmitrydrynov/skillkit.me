export const userJobsQuery = `
query($userSkillId: ID!) {
  userJobs(where: { userSkillId: { equals: $userSkillId } }, orderBy: {startedAt: desc, finishedAt: desc} ) {
    id
    title
    position
    description
    startedAt
    finishedAt
  }
}
`;

export const getUserJobQuery = `
query($id: ID!) {
  userJob(
    where: {
      id: $id
    }
  ) {
    id
    title
    position
    description
    startedAt
    finishedAt
  }
}
`;

export const createUserJobMutation = `
mutation(
  $data: UserJobCreateInput!
) {
  createUserJob(
    data: $data
  ) {
    id
    title
  }
}
`;

export const updateUserJobMutation = `
mutation(
  $recordId: ID!
  $data: UserJobUpdateInput!
) {
  updateUserJob(
    where: {
      id: $recordId
    }
    data: $data
  ) { id }
}
`;

export const deleteUserJobMutation = `
mutation ($where: WhereUniqueInput!) {
  deleteUserJob(where: $where)
}
`;
