export const userSkillsQuery = `
query($userId: ID!) {
  userSkills(
    where: {
      user: {
        id: { equals: $userId }
      }
    }
  ) {
    id
    description
    level
    skill {
    	id
      name
  	}
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
