export default `
type User{
    user_id: String
}

type loginResult{
    success: Boolean!
    result: String
    message: String
}

type Query{
    me: User
}

type Mutation{
    login(account:String!): loginResult
}

`;
