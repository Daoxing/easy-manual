export default `
type Group{
    group_id: String!
    group_nme: String
    group_intro: String
    created_user: User
    all_joined_members: GroupMembers
    join_group_request: joinGroupRequest 
    article_count:Int
    created_tms: Date
    updated_tms: Date
}

type GroupMembers{
    count:Int
    members:[User]
}

type joinGroupRequest{
    count:Int
    members:[User]
}

type createGroupResult{
    success: Boolean!
    message: String
    result: Group
}

type updateGroupResult{
    success: Boolean!
    message: String
    result: Group
}

type inviteUserToGroupResult{
    success: Boolean!
    message: String
    result: Group
}

type approveUserToGroupResult{
    success: Boolean!
    message: String
    result: Group
}

type rejectUserToGroupResult{
    success: Boolean!
    message: String
    result: Group
}

type deleteGroupResult{
    success: Boolean!
    message: String
    result: Group
}

type searchGroupsByNameResult{
    success: Boolean!
    result: [Group!]
    message: String
}
type joinedGroupsResult{
    totalCount:Int!
    groups:[Group]
    page:pageInfo
}

input createGroupInput{
    group_nme:String!
    group_intro:String
}

input updateGroupInput{
    group_id:ID!
    group_nme:String!
    group_intro:String
}

input inviteUserToGroupInput{
    user_id:ID!
    group_id:ID!
}

input approveUserToGroupInput{
    user_id:ID!
    group_id:ID!
}

input rejectUserToGroupInput{
    user_id:ID!
    group_id:ID!
}

input searchGroupsByNameInput{
    name:String!
}

extend type Query{
    joinedGroups(sort:Order,page:Pagination):joinedGroupsResult
    searchGroupByName(searchInfo:searchGroupsByNameInput):searchGroupsByNameResult
} 

extend type Mutation{
    createGroup(groupInfo:createGroupInput!): createGroupResult
    updateGroup(groupInfo:updateGroupInput!): updateGroupResult

    inviteUserToGroup(inviteInfo:inviteUserToGroupInput!): inviteUserToGroupResult

    approveUserToGroup(approveInfo:approveUserToGroupInput!): approveUserToGroupResult
    rejectUserToGroup(rejectInfo:approveUserToGroupInput!): rejectUserToGroupResult

    deleteGroup(groupId:ID!):deleteGroupResult
}

`;
