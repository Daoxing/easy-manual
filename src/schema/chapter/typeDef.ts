export default `
type Chapter{
    chapter_id: String!
    article: Article
    chapter_title: String
    chapter_content: String
    parent_chapter: Chapter
    create_tms: Date
    update_tms: Date
    order: Int
    sub_chapters: [Chapter]
}

type getChapterResult{
    success: Boolean!
    message: String
    result: Chapter
}

type createChapterResult{
    success: Boolean!
    message: String
    result: Chapter
}

type updateChapterResult{
    success: Boolean!
    message: String
    result: Chapter
}

type deleteChapterResult{
    success: Boolean!
    message: String
    result: Chapter
}

input createChapterInput{
    atricle_id:ID!
    chapter_title:String!
    chapter_content:String
    parent_chapter_id:ID
}

input updateChapterInput{
    chapter_id: String!
    chapter_title:String
    chapter_content:String
}

extend type Query{
    getChapter(chapterId:String!): getChapterResult
} 

extend type Mutation{
    createChapter(chapterInfo:createChapterInput!): createChapterResult
    updateChapter(chapterInfo:updateChapterInput!):updateChapterResult
    deleteChapter(chapterId:String!):deleteChapterResult
}

`;
