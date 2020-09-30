export default `
type Group{
    group_id: String
}

extend type Query{
    oneGroup: Group
}

`;
