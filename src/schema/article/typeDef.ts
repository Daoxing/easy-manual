export default `
type Article{
    article_id: ID
    article_nme: String
    article_content: String
    only_me:Boolean
    created_user: User
    created_tms: Date
    updated_tms: Date
    group:Group
    editable: Boolean
}

type getArticleResult{
    success: Boolean
    result: Article
    message: String
}

type createArticleResult{
    success: Boolean
    result: Article
    message: String
}

type updateArticleResult{
    success: Boolean
    result: Article
    message: String
}

type deleteArticleResult{
    success: Boolean
    result: Article
    message: String
}

input createArticleInput{
    article_nme: String
    article_content: String
    group_id: ID
    only_me: Boolean
}

input updateArticleInput{
    article_nme: String
    article_content: String
    group_id:ID
    only_me:Boolean
    article_id: ID!
}

extend type Query{
    getArticle(articleId:String!):getArticleResult
}

extend type Mutation{
    createArticle(articleInfo:createArticleInput): createArticleResult
    updateArticle(articleInfo:updateArticleInput): updateArticleResult
    deleteArticle(articleId:String!):deleteArticleResult
}

`;
