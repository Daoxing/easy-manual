export default `
type User{
    user_id: String
    nme:String,
    email_address:String,
    phone_nbr:String,
    icon_url:String,
    phone_nbr_verify_code:String,
    phone_nbr_verify_code_created_tms:Date,
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

type loginResult{
    success: Boolean!
    result: String
    message: String
}

type verifyCodeResult{
    success: Boolean!
    result: User
    message: String
}

type Query{
    me: User
    verifyCode(code:String!): verifyCodeResult
}

type Mutation{
    login(account:String!): loginResult
}

`;
