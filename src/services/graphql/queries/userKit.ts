export const userKitsQuery = `
query($where: UserKitWhereInput) {
  userKits(
    where: $where
    orderBy: {
      createdAt: desc
    }
  ) {
    id
    experience {
      years
      months
    }
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

export const getUserKitQuery = `
query($id: ID!) {
  userKit(
    where: {
      id: $id
    }
  ) {
    id
    description
    isDraft
    experience {
      years
      months
    }
    userSkills {
      id
      skill { id name }
      isDraft
      viewMode
      level
      isComplexSkill
      experience {
        years
        months
      }
    }
    profession {
    	id
      name
  	}
    updatedAt
    shareLink
  }
}
`;

export const addUserSkillsMutation = `
mutation(
  $recordId: ID!
  $userSkills: [ID!]!
) {
  addUserSkillsToKit(
    where: {
      id: $recordId
    }
    userSkills: $userSkills
  ) { id }
}
`;

export const deleteUserSkillFromKitMutation = `
mutation(
  $recordId: ID!
  $userSkillId: ID!
) {
  deleteUserSkillFromKit(
    where: {
      id: $recordId
    }
    userSkillId: $userSkillId
  ) { id }
}
`;

export const editUserKitMutation = `
mutation(
  $recordId: ID!
  $data: UserKitUpdateInput!
) {
  updateUserKit(
    where: {
      id: $recordId
    }
    data: $data
  ) { id }
}
`;

export const publishUserKitMutation = `
mutation($recordId: ID!, $host: String!) {
  publishUserKit(id: $recordId, host: $host) { id shareLink }
}
`;

export const getUserKitOptionsQuery = `
query($id: ID!) {
  userKit(
    where: {
      id: $id
    }
  ) {
    id
    isDraft
    viewMode
    updatedAt
    shareLink
    experience {
      years
      months
    }
    profession {
      name
    }
    userSkills {
      id
      skill { id name }
      isDraft
    }
  }
}
`;

export const userToolsForKitQuery = `
query($id: ID!) {
  getUserToolsForKit(
    where: {
      id: $id
    }
  ) {
    id
    workTool {
      name
    }
    description
  }
}
`;

export const userFilesForKitQuery = `
query($id: ID!) {
  getUserFilesForKit(
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

export const userSchoolsForKitQuery = `
query($id: ID!) {
  userSchoolsForKit(
    where: {
      id: $id
    }
  ) {
    schoolId
    name
    userSchools {
      id
      startedAt
      finishedAt
      description
    }
  }
}
`;

export const userJobsForKitQuery = `
query($id: ID!) {
  userJobsForKit(
    where: {
      id: $id
    }
  ) {
    workPlaceId
    name
    userJobs {
      id
      position
      startedAt
      finishedAt
      description
    }
  }
}
`;

export const getUserKitForShareQuery = `
query($hash: String!) {
  userKitForShare(hash: $hash) {
    viewer
    user {
      fullName
      age
      about
      country
      avatar
      email
    }
    userKit { 
      viewMode
      description
      profession {
        name
      }
      experience {
        years
        months
      }
      publishedAt
      createdAt
      shareLink
      userSkills {
        level
        viewMode
        shareLink
        skill { name }
        experience {
          years
          months
        }
      }
      userTools {
        description
        workTool {
          name
        }
      }
      userJobs {
        name
        userJobs {
          position
          description
          startedAt
          finishedAt
          workPlace {
            name
          }
        }
      }
      userSchools {
        name
        userSchools {
          description
          startedAt
          finishedAt
          school {
            name
          }
        }
      }
      userFiles {
        title
        description
        url
        type
      }
    }    
  }
}
`;
