export const createProjectMutation = `
mutation createProject($data: ProjectCreateInput!) {
  createProject(data: $data) {
    id
    title
  }
}
`;

export const projectQuery = `
query ($id: ID!) {
  project(where: { id: $id }) {
    id
    title
    description
    settingName
    platforms
    genre
  }
}
`;

export const getProjectsQuery = `
query projects(
  $where: ProjectWhereInput! = {}
  $orderBy: [ProjectOrderByInput!]! = []
  $take: Int
  $skip: Int! = 0
) {
  projects(where: $where, orderBy: $orderBy, take: $take, skip: $skip) {
    id
    title
    genre
    platforms
    description
  }
}
`;
