export default `
type Group{
    group_id: String!
    group_nme: String
    group_intro: String
    created_user: User
}

type createGroupResult{
    success: Boolean!
    message: String
    result: Group
}

input createGroupInput{
    group_nme:String!
    group_intro:String
}

extend type Query{
    myGroups:[Group]!
} 

extend type Mutation{
    createGroup(groupInfo:createGroupInput): createGroupResult
}

`;
