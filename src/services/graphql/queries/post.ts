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
  }
}
`;

export const createPostMutation = `
mutation($name: PostCreateInput!) {
  createPost(data: $data) {
    id
    slug
    title
  }
}
`;
