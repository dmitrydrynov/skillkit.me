export const postsDataQuery = `
query($where: PostWhereInput) {
  posts(where: $where) {
    id
    slug
    title
    description
    content
    featureImage
    readingTime
    createdAt
    updatedAt
    isDraft
    author { id fullName avatar email }
    category { id name }
    viewMode
    publishedAt
  }
}
`;

export const postCategoriesQuery = `
query($where: PostCategoryWhereInput) {
  postCategories(where: $where) {
    id
    slug
    name
    description
  }
}
`;

export const getPostQuery = `
query($where: PostWhereInput!) {
  post(
    where: $where
  ) {
    id
    slug
    title
    description
    content
    readingTime
    featureImage
    createdAt
    updatedAt
    isDraft
    author { id fullName avatar email }
    category { id name }
    viewMode
    publishedAt
  }
}
`;

export const createPostMutation = `
mutation($data: PostCreateInput!) {
  createPost(data: $data) {
    id
    slug
    createdAt
    updatedAt
  }
}
`;

export const updatePostMutation = `
mutation(
  $recordId: ID!
  $data: PostUpdateInput!
) {
  updatePost(
    where: {
      id: $recordId
    }
    data: $data
  ) { 
    id 
    slug
    createdAt
    updatedAt
    isDraft
    viewMode
    featureImage
    description
  }
}
`;

export const publishPostMutation = `
mutation($recordId: ID!) {
  publishPost(id: $recordId) { id publishedAt isDraft viewMode }
}
`;

export const deletePostMutation = `
mutation ($where: WhereUniqueInput!) {
  deletePost(where: $where)
}
`;

export const uploadImageMutation = `
mutation($image: Upload!) {
  uploadImage(image: $image) { url width height }
}
`;

export const removeImageMutation = `
mutation($imageUrl: String!) {
  removeImage(imageUrl: $imageUrl) { result }
}
`;
