export const userFilesQuery = `
query {
  userFiles {
    id
    title
    description
    url
  }
}
`;

export const getUserFileQuery = `
query($id: ID!) {
  userFile(
    where: {
      id: $id
    }
  ) {
    id
    title
    description
    url
  }
}
`;

export const createUserFileMutation = `
mutation(
  $data: UserFileCreateInput!
) {
  createUserFile(
    data: $data
  ) {
    id
    title
    url
  }
}
`;

export const updateUserFileMutation = `
mutation(
  $recordId: ID!
  $data: UserFileUpdateInput!
) {
  updateUserFile(
    where: {
      id: $recordId
    }
    data: $data
  ) { id }
}
`;

export const deleteUserFileMutation = `
mutation ($where: WhereUniqueInput!) {
  deleteUserFile(where: $where)
}
`;
