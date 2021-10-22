export const searchSkillsQuery = `
query($search: String) {
  skills(
    where: {
      name: {contains: $search, mode: insensitive}
    },
    take: 5
  ) {
    id
    name
  }
}
`;

export const createSkillMutation = `
mutation($name: String!) {
  createSkill(data: {
    name: $name
  }) {
    id
    name
  }
}
`;

export const getUserSkillQuery = `
query($id: ID!) {
  userSkill(
    where: {
      id: $id
    }
  ) {
    id
    description
    level
    skill {
    	id
      name
  	}
    jobs {
      id
      title
      company
      description
      startedAt
      finishedAt
    }
    schools {
      id
      title
      description
      startedAt
      finishedAt
    }
    tools {
      title
      description
      level
    }
  }
}
`;
