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
      description
    }
    schools {
      id
      title
      description
    }
    tools {
      title
      description
      level
    }
  }
}
`;
