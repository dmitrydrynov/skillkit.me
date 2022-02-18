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
    publishedAt
    createdAt
    updatedAt
  }
}
`;

export const createUserSkillMutation = `
mutation(
  $skillId: ID!
  $level: UserSkillLevelEnum!
) {
  createUserSkill(
    skillId: $skillId
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
