export const userKitsQuery = `
query($where: UserKitWhereInput) {
  userKits(
    where: $where
    orderBy: {
      createdAt: desc
    }
  ) {
    id
    profession {
      id
      name
    }
    userSkills {
      id
      skill { id name }
      isDraft
      viewMode
    }
    isDraft
    publishedAt
    createdAt
    updatedAt
    shareLink
  }
}
`;

export const createUserKitMutation = `
mutation(
  $professionId: ID
  $professionName: String
  $userSkills: [ID!]
) {
  createUserKit(professionId: $professionId, professionName: $professionName, userSkills: $userSkills) {
    id
  }
}
`;

export const deleteUserKitMutation = `
mutation($where: WhereUniqueInput!) {
  deleteUserKit(where: $where)
}
`;

export const getUserKitQuery = `
query($id: ID!) {
  userKit(
    where: {
      id: $id
    }
  ) {
    id
    description
    isDraft
    userSkills {
      id
      skill { id name }
      isDraft
      viewMode
      level
      isComplexSkill
      experience {
        years
        months
      }
    }
    profession {
    	id
      name
  	}
    updatedAt
    shareLink
  }
}
`;

export const addUserSkillsMutation = `
mutation(
  $recordId: ID!
  $userSkills: [ID!]!
) {
  addUserSkillsToKit(
    where: {
      id: $recordId
    }
    userSkills: $userSkills
  ) { id }
}
`;

export const deleteUserSkillFromKitMutation = `
mutation(
  $recordId: ID!
  $userSkillId: ID!
) {
  deleteUserSkillFromKit(
    where: {
      id: $recordId
    }
    userSkillId: $userSkillId
  ) { id }
}
`;

export const editUserKitMutation = `
mutation(
  $recordId: ID!
  $data: UserKitUpdateInput!
) {
  updateUserKit(
    where: {
      id: $recordId
    }
    data: $data
  ) { id }
}
`;

export const publishUserKitMutation = `
mutation($recordId: ID!, $host: String!) {
  publishUserKit(id: $recordId, host: $host) { id shareLink }
}
`;

export const getUserKitOptionsQuery = `
query($id: ID!) {
  userKit(
    where: {
      id: $id
    }
  ) {
    id
    isDraft
    viewMode
    updatedAt
    shareLink
    profession {
      name
    }
    userSkills {
      id
      skill { id name }
      isDraft
    }
  }
}
`;
