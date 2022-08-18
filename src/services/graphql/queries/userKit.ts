export const userKitsQuery = `
query($where: UserKitWhereInput) {
  userKits(
    where: $where
    orderBy: {
      createdAt: desc
    }
  ) {
    id
    profession {
      id
      name
    }
    userSkills {
      id
      skill { id name }
      isDraft
      viewMode
    }
    isDraft
    publishedAt
    createdAt
    updatedAt
    shareLink
  }
}
`;

export const createUserKitMutation = `
mutation(
  $professionId: ID
  $professionName: String
  $userSkills: [ID!]
) {
  createUserKit(professionId: $professionId, professionName: $professionName, userSkills: $userSkills) {
    id
  }
}
`;

export const deleteUserKitMutation = `
mutation($where: WhereUniqueInput!) {
  deleteUserKit(where: $where)
}
`;
