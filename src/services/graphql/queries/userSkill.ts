export const getUserSkillQuery = `
query($id: ID!) {
  userSkill(
    where: {
      id: $id
    }
  ) {
    id
    description
    isDraft
    level
    skill {
    	id
      name
  	}
    updatedAt
    shareLink
  }
}
`;

export const getUserSkillOptionsQuery = `
query($id: ID!) {
  userSkill(
    where: {
      id: $id
    }
  ) {
    id
    isDraft
    viewMode
    updatedAt
    shareLink
  }
}
`;

export const userSkillsQuery = `
query {
  userSkills(
    orderBy: {
      level: desc
    }
  ) {
    id
    skill {
      id
      name
    }
    level
    isDraft
    experience {
      years
      months
    }
    publishedAt
    createdAt
    updatedAt
    shareLink
  }
}
`;

export const createUserSkillMutation = `
mutation(
  $skillId: ID
  $skillName: String
  $level: UserSkillLevelEnum!
) {
  createUserSkill(
    skillId: $skillId
    skillName: $skillName
    level: $level
  ) {
    id
  }
}
`;

export const editUserSkillMutation = `
mutation(
  $recordId: ID!
  $data: UserSkillUpdateInput!
) {
  updateUserSkill(
    where: {
      id: $recordId
    }
    data: $data
  ) { id }
}
`;

export const deleteUserSkillMutation = `
mutation ($where: WhereUniqueInput!) {
  deleteUserSkill(where: $where)
}
`;

export const updateUserSkillVisibilityMutation = `
mutation(
  $recordId: ID!
  $isVisible: Boolean!
) {
  updateUserSkill(
    where: {
      id: $recordId
    }
    data: {
      isVisible: $isVisible
    }
  ) { id isVisible }
}
`;

export const publishUserSkillMutation = `
mutation($recordId: ID!, $host: String!) {
  publishUserSkill(id: $recordId, host: $host) { id shareLink }
}
`;

export const getUserSkillByHashQuery = `
query($hash: String!) {
  userSkillByHash(hash: $hash) {
    id
    description
    skill {
      id
      name
    }
    level
    experience {
      years
      months
    }
    publishedAt
    createdAt
    updatedAt
    shareLink
  }
}
`;
