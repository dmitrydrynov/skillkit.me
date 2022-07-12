export const postsDataQuery = `
query {
  posts {
    id
    slug
    title
    content
    createdAt
    updatedAt
    isDraft
    author { id fullName avatar email }
    category { id name }
    viewMode
  }
}
`;

export const getPostQuery = `
query($id: ID!) {
  post(
    where: {
      id: $id
    }
  ) {
    id
    slug
    title
    content
    createdAt
    updatedAt
    isDraft
    author { id fullName avatar email }
    category { id name }
    viewMode
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
  }
}
`;

export const publishPostMutation = `
mutation($recordId: ID!) {
  publishPost(id: $recordId) { id publishedAt isDraft viewMode }
}
`;
