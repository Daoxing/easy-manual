export default `
type User{
    user_id: String
}

type Mutation{
    signUp: User
}
extend type Query{
    oneUser: User
}

`;
