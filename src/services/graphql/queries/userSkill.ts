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
  $skillId: ID!
  $level: String!
  $description: String
  $schools: UserSchoolRelateToManyForUpdateInput
  $tools: UserToolRelateToManyForUpdateInput
  $jobs: UserJobRelateToManyForUpdateInput
) {
  updateUserSkill(
    where: {
      id: $recordId
    }
    data: {
      skill: {
        connect: {
          id: $skillId
        }
      }
      schools: $schools
      jobs: $jobs
      tools: $tools
      level: $level
      description: $description
    }
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
