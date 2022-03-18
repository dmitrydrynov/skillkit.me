export const userFilesQuery = `
query($attachType: String!, $attachId: ID!) {
  userFiles(attachType: $attachType, attachId: $attachId) {
    id
    title
    description
    url
    type
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
    type
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
