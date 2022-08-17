export const createUserKitMutation = `
mutation(
  $kitId: ID
  $kitName: String
) {
  createUserKit(
    kitId: $kitId
    kitName: $kitName
  ) {
    id
  }
}
`;
