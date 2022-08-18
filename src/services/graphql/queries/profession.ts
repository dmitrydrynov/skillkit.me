export const searchProfessionsQuery = `
query($search: String) {
  professions(
    where: {
      name: {contains: $search, mode: insensitive}
    },
    take: 5
  ) {
    id
    name
    createdAt
    updatedAt
  }
}
`;

export const professionsDataQuery = `
query {
  professions {
    id
    name
    createdAt
    updatedAt
  }
}
`;

export const createProfessionMutation = `
mutation($name: String!) {
  createProfession(name: $name) {
    id
    name
  }
}
`;
