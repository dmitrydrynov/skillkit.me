export const getUserSkillQuery = `
query($id: ID!) {
  userSkill(
    where: {
      id: $id
    }
  ) {
    id
    description
    isDraft
    isComplexSkill
    subSkills {
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
    level
    skill {
    	id
      name
  	}
    updatedAt
    shareLink
  }
}
`;

export const getSubSkillsQuery = `
query($id: ID!) {
  userSkill(
    where: {
      id: $id
    }
  ) {
    id
    isComplexSkill
    subSkills {
      id
      skill { id name }
      isDraft
    }
  }
}
`;

export const getUserSkillOptionsQuery = `
query($id: ID!) {
  userSkill(
    where: {
      id: $id
    }
  ) {
    id
    isDraft
    viewMode
    updatedAt
    shareLink
    skill {
      name
    }
    isComplexSkill
    subSkills {
      id
      skill { id name }
      isDraft
      isComplexSkill
    }
  }
}
`;

export const userSkillsQuery = `
query($where: UserSkillWhereInput) {
  userSkills(
    where: $where
    orderBy: {
      level: desc
    }
  ) {
    id
    skill {
      id
      name
    }
    isComplexSkill
    level
    isDraft
    experience {
      years
      months
    }
    publishedAt
    createdAt
    updatedAt
    shareLink
  }
}
`;

export const addSubSkillsMutation = `
mutation(
  $userSkillId: ID!
  $subSkills: [ID!]
) {
  addSubSkills(
    where: {
      id: $userSkillId
    }
    subSkills: $subSkills
  ) {
    id 
    isComplexSkill 
    subSkills { 
      id 
      skill { 
        id 
        name 
      }
    }
  }
}
`;

export const deleteSubSkillMutation = `
mutation(
  $userSkillId: ID!
  $subSkillId: ID!
) {
  deleteSubSkill(
    where: {
      id: $userSkillId
    }
    subSkillId: $subSkillId
  ) {
    id 
    isComplexSkill 
    subSkills { 
      id 
      skill { 
        id
        name
      }
    }
  }
}
`;

export const createUserSkillMutation = `
mutation(
  $skillId: ID
  $skillName: String
  $level: UserSkillLevelEnum!
) {
  createUserSkill(
    skillId: $skillId
    skillName: $skillName
    level: $level
  ) {
    id
  }
}
`;

export const editUserSkillMutation = `
mutation(
  $recordId: ID!
  $data: UserSkillUpdateInput!
) {
  updateUserSkill(
    where: {
      id: $recordId
    }
    data: $data
  ) { id }
}
`;

export const deleteUserSkillMutation = `
mutation ($where: WhereUniqueInput!) {
  deleteUserSkill(where: $where)
}
`;

export const updateUserSkillVisibilityMutation = `
mutation(
  $recordId: ID!
  $isVisible: Boolean!
) {
  updateUserSkill(
    where: {
      id: $recordId
    }
    data: {
      isVisible: $isVisible
    }
  ) { id isVisible }
}
`;

export const publishUserSkillMutation = `
mutation($recordId: ID!, $host: String!) {
  publishUserSkill(id: $recordId, host: $host) { id shareLink }
}
`;

export const getUserSkillByHashQuery = `
query($hash: String!) {
  userSkillByHash(hash: $hash) {
    id
    description
    skill {
      id
      name
    }
    level
    experience {
      years
      months
    }
    publishedAt
    createdAt
    updatedAt
    shareLink
  }
}
`;

export const getUserSkillForShareQuery = `
query($hash: String!) {
  userSkillForShare(hash: $hash) {
    viewer
    user {
      fullName
      age
      about
      country
      avatar
      email
    }
    skill { 
      id
      viewMode
      description
      skill {
        id
        name
      }
      level
      experience {
        years
        months
      }
      publishedAt
      createdAt
      shareLink
      isComplexSkill
      subSkills {
        id
        level
        viewMode
        shareLink
        isComplexSkill
        skill { name }
        experience {
          years
          months
        }
      }
      tools {
        title
        description
      }
      schools {
        title
        description
        startedAt
        finishedAt
      }
      jobs {
        title
        position
        description
        startedAt
        finishedAt
        experience {
          years
          months
        }
      }
      files {
        id
        title
        description
        url
        type
      }
    }
  }
}
`;

export const sendEmailByHashMutation = `
mutation(
  $name: String!,
  $email: String!,
  $content: String!,
  $hash: String!
) {
  sendEmailByHash(
    name: $name
    email: $email
    content: $content
    hash: $hash
  ) {
    result
  }
}`;
