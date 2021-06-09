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
    bookmarked: Boolean
}

type getArticleResult{
    success: Boolean
    result: Article
    message: String
}

type getUsersAllArticlesResult{
    totalCount:Int!
    articles:[Article]
    page:pageInfo
}

type getUsersAllPublicArticlesResult{
    totalCount:Int!
    articles:[Article]
    page:pageInfo
}

type getUsersAccessibleArticlesResult{
    totalCount:Int!
    articles:[Article]
    page:pageInfo
}
type getArticlesInGroupResult{
    totalCount:Int!
    articles:[Article]
    page:pageInfo
}

type QueryArticlesResult{
    totalCount:Int!
    articles:[Article]
    page:pageInfo
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

type ArticleMutationResult{
    success: Boolean
    result: Article
    message: String
}

type pageInfo{
    pageNo:Int!
    pageCount:Int!
}
input Order{
    field:String!
    order:OrderEnum!
}
enum OrderEnum{
    ASC
    DESC
}
input Pagination{
    pageNo:Int!
    pageCount:Int!
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
    getArticle(articleId:ID!):getArticleResult
    getUsersAllArticles(sort:Order,page:Pagination):getUsersAllArticlesResult
    getUsersAllPublicArticles(sort:Order,page:Pagination):getUsersAllPublicArticlesResult
    getUsersAccessibleArticles(sort:Order,page:Pagination):getUsersAccessibleArticlesResult
    getArticlesInGroup(group_id:ID!,sort:Order,page:Pagination):getArticlesInGroupResult
    bookmarkedArticles(sort:Order,page:Pagination):QueryArticlesResult
}

extend type Mutation{
    createArticle(articleInfo:createArticleInput): createArticleResult
    updateArticle(articleInfo:updateArticleInput): updateArticleResult
    deleteArticle(articleId:ID!):deleteArticleResult
    bookmarkArticle(articleId:ID!):ArticleMutationResult
    removeArticleBookmark(articleId:ID!):ArticleMutationResult
}

`;
