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

export const skillsDataQuery = `
query {
  skills {
    id
    name
    createdAt
  }
}
`;

export const createSkillMutation = `
mutation($name: String!) {
  createSkill(name: $name) {
    id
    name
  }
}
`;
