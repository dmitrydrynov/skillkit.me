export const postCategoriesDataQuery = `
query($where: PostCategoryWhereInput) {
  postCategories(where: $where) {
    id
    name
    slug
    description
  }
}
`;

export const getPostCategoryQuery = `
query($where: PostCategoryWhereInput!) {
  postCategory(
    where: $where
  ) {
    id
    name
    slug
    description
  }
}
`;
