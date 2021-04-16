export default `
type User{
    user_id: String!
    user_nme:String,
    email_address:String,
    phone_nbr:String,
    icon_url:String,
    verify_code:String,
    verify_code_created_tms:Date,
    created_tms:Date,
    updated_tms:Date,
    last_login_tms:Date,
    accept_terms:Boolean,
    deleted:Boolean,
    gender:GENDERENUM,
}

enum GENDERENUM{
    MALE
    FEMALE
    UNKNOWN
}

type verifyCodeResult{
    success: Boolean!
    result: User
    message: String
}

type UpdateUserResult{
    success: Boolean!
    result: User
    message: String
}

type searchUsersByNameResult{
    success: Boolean!
    result: [User!]
    message: String
}

input UpdateUserInput{
    user_nme:String,
    email_address:String,
    phone_nbr:String,
    gender:GENDERENUM,
}

input searchUsersByNameInput{
    name:String!
    group_id:ID
}

extend type Query{
    me: User
    searchUsersByName(searchInfo:searchUsersByNameInput):searchUsersByNameResult
}

extend type Mutation{
    verifyCode(code:String!): verifyCodeResult
    updateUser(userInfo:UpdateUserInput!): UpdateUserResult
}

`;
