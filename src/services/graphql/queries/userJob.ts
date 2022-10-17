export const userJobsQuery = `
query($userSkillId: ID!) {
  userJobs(where: { userSkillId: { equals: $userSkillId } }, orderBy: {startedAt: desc, finishedAt: desc} ) {
    id
    workPlace {
      id
      name
    }
    position
    description
    startedAt
    finishedAt
    experience {
      years
      months
    }
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
    workPlace {
      id
      name
    }
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
    workPlace {
      id
      name
    }
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
