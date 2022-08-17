export const searchKitsQuery = `
query($search: String) {
  kits(
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

export const kitsDataQuery = `
query {
  kits {
    id
    name
    createdAt
  }
}
`;

export const createKitMutation = `
mutation($name: String!) {
  createKit(name: $name) {
    id
    name
  }
}
`;
