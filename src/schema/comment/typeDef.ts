export default `
type Comment{
    comment_id: ID!
    comment_txt: String
    article: Article
    created_tms: Date
    updated_tms: Date
    created_user: User
}

type getCommentListResult{
    success: Boolean!
    message: String
    result: [Comment]
}

type createCommentResult{
    success: Boolean!
    message: String
    result: Comment
}

type updateCommentResult{
    success: Boolean!
    message: String
    result: Comment
}

type deleteCommentResult{
    success: Boolean!
    message: String
    result: Comment
}

input createCommentInput{
    article_id:ID!
    comment_txt:String!
}

input updateCommentInput{
    comment_id:ID!
    comment_txt:String!
}

extend type Query{
    commentList(articleId:String!)getCommentListResult
} 

extend type Mutation{
    createComment(commentInfo:createCommentInput!)createCommentResult
    updateComment(commentInfo:updateCommentInput!)updateCommentResult
    deleteComment(commentId:String!)deleteCommentResult
}

`;
