export const searchWorkPlacesQuery = `
query($search: String) {
  workPlaces(
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

export const workPlacesDataQuery = `
query {
  workPlaces {
    id
    name
    createdAt
  }
}
`;

export const createWorkPlaceMutation = `
mutation($name: String!) {
  createWorkPlace(name: $name) {
    id
    name
  }
}
`;
