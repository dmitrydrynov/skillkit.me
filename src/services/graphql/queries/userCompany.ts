export const searchUserCompaniesQuery = `
query($search: String) {
  userCompanies(
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

export const userCompaniesDataQuery = `
query {
  userCompanies {
    id
    name
    createdAt
  }
}
`;

export const createUserCompanyMutation = `
mutation($name: String!) {
  createUserCompany(name: $name) {
    id
    name
  }
}
`;
