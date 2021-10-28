export const userSkillsQuery = `
query($userId: ID!) {
  userSkills(
    where: {
      user: {
        id: { equals: $userId }
      }
    }
    orderBy: {
      level: desc
    }
  ) {
    id
    description
    level
    skill {id, name}
    tools {id, title}
    jobs {id, title}
    schools {id, title}
  }
}
`;

export const createUserSkillMutation = `
mutation(
  $userId: ID!
  $skillId: ID!
  $level: String!
  $description: String
  $schools: UserSchoolRelateToManyForCreateInput
  $tools: UserToolRelateToManyForCreateInput
  $jobs: UserJobRelateToManyForCreateInput
) {
  createUserSkill(data: {
    user: { 
      connect: {
        id: $userId
      }
    }
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
  }) {
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
  $schools: UserSchoolRelateToManyForCreateInput
  $tools: UserToolRelateToManyForCreateInput
  $jobs: UserJobRelateToManyForCreateInput
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
  }) {
    id
  }
}
`;
