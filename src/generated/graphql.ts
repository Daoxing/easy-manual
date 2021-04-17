import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Article = {
  __typename?: 'Article';
  article_id?: Maybe<Scalars['ID']>;
  article_nme?: Maybe<Scalars['String']>;
  article_content?: Maybe<Scalars['String']>;
  created_user?: Maybe<User>;
  created_tms?: Maybe<Scalars['Date']>;
  updated_tms?: Maybe<Scalars['Date']>;
  group?: Maybe<Group>;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export type Chapter = {
  __typename?: 'Chapter';
  chapter_id: Scalars['String'];
  article?: Maybe<Article>;
  chapter_title?: Maybe<Scalars['String']>;
  chapter_content?: Maybe<Scalars['String']>;
  parent_chapter?: Maybe<Chapter>;
  create_tms?: Maybe<Scalars['Date']>;
  update_tms?: Maybe<Scalars['Date']>;
  order?: Maybe<Scalars['Int']>;
  sub_chapters?: Maybe<Array<Maybe<Chapter>>>;
};

export type Group = {
  __typename?: 'Group';
  group_id: Scalars['String'];
  group_nme?: Maybe<Scalars['String']>;
  group_intro?: Maybe<Scalars['String']>;
  created_user?: Maybe<User>;
  all_joined_members?: Maybe<GroupMembers>;
  join_group_request?: Maybe<JoinGroupRequest>;
};

export type GroupMembers = {
  __typename?: 'GroupMembers';
  count?: Maybe<Scalars['Int']>;
  members?: Maybe<Array<Maybe<User>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  root: Scalars['String'];
  createGroup?: Maybe<CreateGroupResult>;
  updateGroup?: Maybe<UpdateGroupResult>;
  inviteUserToGroup?: Maybe<InviteUserToGroupResult>;
  approveUserToGroup?: Maybe<ApproveUserToGroupResult>;
  rejectUserToGroup?: Maybe<RejectUserToGroupResult>;
  deleteGroup?: Maybe<DeleteGroupResult>;
  login?: Maybe<LoginResult>;
  verifyCode?: Maybe<VerifyCodeResult>;
  updateUser?: Maybe<UpdateUserResult>;
  createArticle?: Maybe<CreateArticleResult>;
  updateArticle?: Maybe<UpdateArticleResult>;
  deleteArticle?: Maybe<DeleteArticleResult>;
  createChapter?: Maybe<CreateChapterResult>;
  updateChapter?: Maybe<UpdateChapterResult>;
  deleteChapter?: Maybe<DeleteChapterResult>;
};

export type MutationCreateGroupArgs = {
  groupInfo: CreateGroupInput;
};

export type MutationUpdateGroupArgs = {
  groupInfo: UpdateGroupInput;
};

export type MutationInviteUserToGroupArgs = {
  inviteInfo: InviteUserToGroupInput;
};

export type MutationApproveUserToGroupArgs = {
  approveInfo: ApproveUserToGroupInput;
};

export type MutationRejectUserToGroupArgs = {
  rejectInfo: ApproveUserToGroupInput;
};

export type MutationDeleteGroupArgs = {
  groupId: Scalars['ID'];
};

export type MutationLoginArgs = {
  account: Scalars['String'];
};

export type MutationVerifyCodeArgs = {
  code: Scalars['String'];
};

export type MutationUpdateUserArgs = {
  userInfo: UpdateUserInput;
};

export type MutationCreateArticleArgs = {
  articleInfo?: Maybe<CreateArticleInput>;
};

export type MutationUpdateArticleArgs = {
  articleInfo?: Maybe<UpdateArticleInput>;
};

export type MutationDeleteArticleArgs = {
  articleId: Scalars['String'];
};

export type MutationCreateChapterArgs = {
  chapterInfo: CreateChapterInput;
};

export type MutationUpdateChapterArgs = {
  chapterInfo: UpdateChapterInput;
};

export type MutationDeleteChapterArgs = {
  chapterId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  root: Scalars['String'];
  myGroups?: Maybe<Array<Group>>;
  searchGroupByName?: Maybe<SearchGroupsByNameResult>;
  me?: Maybe<User>;
  searchUsersByName?: Maybe<SearchUsersByNameResult>;
  getArticle?: Maybe<GetArticleResult>;
  getChapter?: Maybe<GetChapterResult>;
};

export type QuerySearchGroupByNameArgs = {
  searchInfo?: Maybe<SearchGroupsByNameInput>;
};

export type QuerySearchUsersByNameArgs = {
  searchInfo?: Maybe<SearchUsersByNameInput>;
};

export type QueryGetArticleArgs = {
  articleId: Scalars['String'];
};

export type QueryGetChapterArgs = {
  chapterId: Scalars['String'];
};

export type UpdateUserInput = {
  user_nme?: Maybe<Scalars['String']>;
  email_address?: Maybe<Scalars['String']>;
  phone_nbr?: Maybe<Scalars['String']>;
  gender?: Maybe<Genderenum>;
};

export type UpdateUserResult = {
  __typename?: 'UpdateUserResult';
  success: Scalars['Boolean'];
  result?: Maybe<User>;
  message?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  user_id: Scalars['String'];
  user_nme?: Maybe<Scalars['String']>;
  email_address?: Maybe<Scalars['String']>;
  phone_nbr?: Maybe<Scalars['String']>;
  icon_url?: Maybe<Scalars['String']>;
  verify_code?: Maybe<Scalars['String']>;
  verify_code_created_tms?: Maybe<Scalars['Date']>;
  created_tms?: Maybe<Scalars['Date']>;
  updated_tms?: Maybe<Scalars['Date']>;
  last_login_tms?: Maybe<Scalars['Date']>;
  accept_terms?: Maybe<Scalars['Boolean']>;
  deleted?: Maybe<Scalars['Boolean']>;
  gender?: Maybe<Genderenum>;
};

export type ApproveUserToGroupInput = {
  user_id: Scalars['ID'];
  group_id: Scalars['ID'];
};

export type ApproveUserToGroupResult = {
  __typename?: 'approveUserToGroupResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  result?: Maybe<Group>;
};

export type CreateArticleInput = {
  article_nme?: Maybe<Scalars['String']>;
  article_contenet?: Maybe<Scalars['String']>;
  group_id?: Maybe<Scalars['ID']>;
  only_me?: Maybe<Scalars['Boolean']>;
};

export type CreateArticleResult = {
  __typename?: 'createArticleResult';
  success?: Maybe<Scalars['Boolean']>;
  result?: Maybe<Article>;
  message?: Maybe<Scalars['String']>;
};

export type CreateChapterInput = {
  atricle_id: Scalars['ID'];
  chapter_title: Scalars['String'];
  chapter_content?: Maybe<Scalars['String']>;
  parent_chapter_id?: Maybe<Scalars['ID']>;
};

export type CreateChapterResult = {
  __typename?: 'createChapterResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  result?: Maybe<Chapter>;
};

export type CreateGroupInput = {
  group_nme: Scalars['String'];
  group_intro?: Maybe<Scalars['String']>;
};

export type CreateGroupResult = {
  __typename?: 'createGroupResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  result?: Maybe<Group>;
};

export type DeleteArticleResult = {
  __typename?: 'deleteArticleResult';
  success?: Maybe<Scalars['Boolean']>;
  result?: Maybe<Article>;
  message?: Maybe<Scalars['String']>;
};

export type DeleteChapterResult = {
  __typename?: 'deleteChapterResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  result?: Maybe<Chapter>;
};

export type DeleteGroupResult = {
  __typename?: 'deleteGroupResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  result?: Maybe<Group>;
};

export type GetArticleResult = {
  __typename?: 'getArticleResult';
  success?: Maybe<Scalars['Boolean']>;
  result?: Maybe<Article>;
  message?: Maybe<Scalars['String']>;
};

export type GetChapterResult = {
  __typename?: 'getChapterResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  result?: Maybe<Chapter>;
};

export type InviteUserToGroupInput = {
  user_id: Scalars['ID'];
  group_id: Scalars['ID'];
};

export type InviteUserToGroupResult = {
  __typename?: 'inviteUserToGroupResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  result?: Maybe<Group>;
};

export type JoinGroupRequest = {
  __typename?: 'joinGroupRequest';
  count?: Maybe<Scalars['Int']>;
  members?: Maybe<Array<Maybe<User>>>;
};

export type LoginResult = {
  __typename?: 'loginResult';
  success: Scalars['Boolean'];
  result?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type RejectUserToGroupInput = {
  user_id: Scalars['ID'];
  group_id: Scalars['ID'];
};

export type RejectUserToGroupResult = {
  __typename?: 'rejectUserToGroupResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  result?: Maybe<Group>;
};

export type SearchGroupsByNameInput = {
  name: Scalars['String'];
};

export type SearchGroupsByNameResult = {
  __typename?: 'searchGroupsByNameResult';
  success: Scalars['Boolean'];
  result?: Maybe<Array<Group>>;
  message?: Maybe<Scalars['String']>;
};

export type SearchUsersByNameInput = {
  name: Scalars['String'];
  group_id?: Maybe<Scalars['ID']>;
};

export type SearchUsersByNameResult = {
  __typename?: 'searchUsersByNameResult';
  success: Scalars['Boolean'];
  result?: Maybe<Array<User>>;
  message?: Maybe<Scalars['String']>;
};

export type UpdateArticleInput = {
  article_nme: Scalars['String'];
  article_id: Scalars['ID'];
};

export type UpdateArticleResult = {
  __typename?: 'updateArticleResult';
  success?: Maybe<Scalars['Boolean']>;
  result?: Maybe<Article>;
  message?: Maybe<Scalars['String']>;
};

export type UpdateChapterInput = {
  chapter_id: Scalars['String'];
  chapter_title?: Maybe<Scalars['String']>;
  chapter_content?: Maybe<Scalars['String']>;
};

export type UpdateChapterResult = {
  __typename?: 'updateChapterResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  result?: Maybe<Chapter>;
};

export type UpdateGroupInput = {
  group_id: Scalars['ID'];
  group_nme: Scalars['String'];
  group_intro?: Maybe<Scalars['String']>;
};

export type UpdateGroupResult = {
  __typename?: 'updateGroupResult';
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
  result?: Maybe<Group>;
};

export type VerifyCodeResult = {
  __typename?: 'verifyCodeResult';
  success: Scalars['Boolean'];
  result?: Maybe<User>;
  message?: Maybe<Scalars['String']>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Article: ResolverTypeWrapper<Article>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  CacheControlScope: CacheControlScope;
  Chapter: ResolverTypeWrapper<Chapter>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  GENDERENUM: Genderenum;
  Group: ResolverTypeWrapper<Group>;
  GroupMembers: ResolverTypeWrapper<GroupMembers>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  UpdateUserInput: UpdateUserInput;
  UpdateUserResult: ResolverTypeWrapper<UpdateUserResult>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  User: ResolverTypeWrapper<User>;
  approveUserToGroupInput: ApproveUserToGroupInput;
  approveUserToGroupResult: ResolverTypeWrapper<ApproveUserToGroupResult>;
  createArticleInput: CreateArticleInput;
  createArticleResult: ResolverTypeWrapper<CreateArticleResult>;
  createChapterInput: CreateChapterInput;
  createChapterResult: ResolverTypeWrapper<CreateChapterResult>;
  createGroupInput: CreateGroupInput;
  createGroupResult: ResolverTypeWrapper<CreateGroupResult>;
  deleteArticleResult: ResolverTypeWrapper<DeleteArticleResult>;
  deleteChapterResult: ResolverTypeWrapper<DeleteChapterResult>;
  deleteGroupResult: ResolverTypeWrapper<DeleteGroupResult>;
  getArticleResult: ResolverTypeWrapper<GetArticleResult>;
  getChapterResult: ResolverTypeWrapper<GetChapterResult>;
  inviteUserToGroupInput: InviteUserToGroupInput;
  inviteUserToGroupResult: ResolverTypeWrapper<InviteUserToGroupResult>;
  joinGroupRequest: ResolverTypeWrapper<JoinGroupRequest>;
  loginResult: ResolverTypeWrapper<LoginResult>;
  rejectUserToGroupInput: RejectUserToGroupInput;
  rejectUserToGroupResult: ResolverTypeWrapper<RejectUserToGroupResult>;
  searchGroupsByNameInput: SearchGroupsByNameInput;
  searchGroupsByNameResult: ResolverTypeWrapper<SearchGroupsByNameResult>;
  searchUsersByNameInput: SearchUsersByNameInput;
  searchUsersByNameResult: ResolverTypeWrapper<SearchUsersByNameResult>;
  updateArticleInput: UpdateArticleInput;
  updateArticleResult: ResolverTypeWrapper<UpdateArticleResult>;
  updateChapterInput: UpdateChapterInput;
  updateChapterResult: ResolverTypeWrapper<UpdateChapterResult>;
  updateGroupInput: UpdateGroupInput;
  updateGroupResult: ResolverTypeWrapper<UpdateGroupResult>;
  verifyCodeResult: ResolverTypeWrapper<VerifyCodeResult>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Article: Article;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Chapter: Chapter;
  Int: Scalars['Int'];
  Date: Scalars['Date'];
  Group: Group;
  GroupMembers: GroupMembers;
  Mutation: {};
  Query: {};
  UpdateUserInput: UpdateUserInput;
  UpdateUserResult: UpdateUserResult;
  Boolean: Scalars['Boolean'];
  Upload: Scalars['Upload'];
  User: User;
  approveUserToGroupInput: ApproveUserToGroupInput;
  approveUserToGroupResult: ApproveUserToGroupResult;
  createArticleInput: CreateArticleInput;
  createArticleResult: CreateArticleResult;
  createChapterInput: CreateChapterInput;
  createChapterResult: CreateChapterResult;
  createGroupInput: CreateGroupInput;
  createGroupResult: CreateGroupResult;
  deleteArticleResult: DeleteArticleResult;
  deleteChapterResult: DeleteChapterResult;
  deleteGroupResult: DeleteGroupResult;
  getArticleResult: GetArticleResult;
  getChapterResult: GetChapterResult;
  inviteUserToGroupInput: InviteUserToGroupInput;
  inviteUserToGroupResult: InviteUserToGroupResult;
  joinGroupRequest: JoinGroupRequest;
  loginResult: LoginResult;
  rejectUserToGroupInput: RejectUserToGroupInput;
  rejectUserToGroupResult: RejectUserToGroupResult;
  searchGroupsByNameInput: SearchGroupsByNameInput;
  searchGroupsByNameResult: SearchGroupsByNameResult;
  searchUsersByNameInput: SearchUsersByNameInput;
  searchUsersByNameResult: SearchUsersByNameResult;
  updateArticleInput: UpdateArticleInput;
  updateArticleResult: UpdateArticleResult;
  updateChapterInput: UpdateChapterInput;
  updateChapterResult: UpdateChapterResult;
  updateGroupInput: UpdateGroupInput;
  updateGroupResult: UpdateGroupResult;
  verifyCodeResult: VerifyCodeResult;
};

export type ArticleResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Article'] = ResolversParentTypes['Article']
> = {
  article_id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  article_nme?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  article_content?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  created_user?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType
  >;
  created_tms?: Resolver<
    Maybe<ResolversTypes['Date']>,
    ParentType,
    ContextType
  >;
  updated_tms?: Resolver<
    Maybe<ResolversTypes['Date']>,
    ParentType,
    ContextType
  >;
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ChapterResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Chapter'] = ResolversParentTypes['Chapter']
> = {
  chapter_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  article?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType>;
  chapter_title?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  chapter_content?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  parent_chapter?: Resolver<
    Maybe<ResolversTypes['Chapter']>,
    ParentType,
    ContextType
  >;
  create_tms?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  update_tms?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  sub_chapters?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['Chapter']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type GroupResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']
> = {
  group_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  group_nme?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  group_intro?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  created_user?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType
  >;
  all_joined_members?: Resolver<
    Maybe<ResolversTypes['GroupMembers']>,
    ParentType,
    ContextType
  >;
  join_group_request?: Resolver<
    Maybe<ResolversTypes['joinGroupRequest']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupMembersResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GroupMembers'] = ResolversParentTypes['GroupMembers']
> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  members?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['User']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  root?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createGroup?: Resolver<
    Maybe<ResolversTypes['createGroupResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateGroupArgs, 'groupInfo'>
  >;
  updateGroup?: Resolver<
    Maybe<ResolversTypes['updateGroupResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateGroupArgs, 'groupInfo'>
  >;
  inviteUserToGroup?: Resolver<
    Maybe<ResolversTypes['inviteUserToGroupResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationInviteUserToGroupArgs, 'inviteInfo'>
  >;
  approveUserToGroup?: Resolver<
    Maybe<ResolversTypes['approveUserToGroupResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationApproveUserToGroupArgs, 'approveInfo'>
  >;
  rejectUserToGroup?: Resolver<
    Maybe<ResolversTypes['rejectUserToGroupResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationRejectUserToGroupArgs, 'rejectInfo'>
  >;
  deleteGroup?: Resolver<
    Maybe<ResolversTypes['deleteGroupResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteGroupArgs, 'groupId'>
  >;
  login?: Resolver<
    Maybe<ResolversTypes['loginResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, 'account'>
  >;
  verifyCode?: Resolver<
    Maybe<ResolversTypes['verifyCodeResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationVerifyCodeArgs, 'code'>
  >;
  updateUser?: Resolver<
    Maybe<ResolversTypes['UpdateUserResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, 'userInfo'>
  >;
  createArticle?: Resolver<
    Maybe<ResolversTypes['createArticleResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateArticleArgs, never>
  >;
  updateArticle?: Resolver<
    Maybe<ResolversTypes['updateArticleResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateArticleArgs, never>
  >;
  deleteArticle?: Resolver<
    Maybe<ResolversTypes['deleteArticleResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteArticleArgs, 'articleId'>
  >;
  createChapter?: Resolver<
    Maybe<ResolversTypes['createChapterResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateChapterArgs, 'chapterInfo'>
  >;
  updateChapter?: Resolver<
    Maybe<ResolversTypes['updateChapterResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateChapterArgs, 'chapterInfo'>
  >;
  deleteChapter?: Resolver<
    Maybe<ResolversTypes['deleteChapterResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteChapterArgs, 'chapterId'>
  >;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  root?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  myGroups?: Resolver<
    Maybe<Array<ResolversTypes['Group']>>,
    ParentType,
    ContextType
  >;
  searchGroupByName?: Resolver<
    Maybe<ResolversTypes['searchGroupsByNameResult']>,
    ParentType,
    ContextType,
    RequireFields<QuerySearchGroupByNameArgs, never>
  >;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  searchUsersByName?: Resolver<
    Maybe<ResolversTypes['searchUsersByNameResult']>,
    ParentType,
    ContextType,
    RequireFields<QuerySearchUsersByNameArgs, never>
  >;
  getArticle?: Resolver<
    Maybe<ResolversTypes['getArticleResult']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetArticleArgs, 'articleId'>
  >;
  getChapter?: Resolver<
    Maybe<ResolversTypes['getChapterResult']>,
    ParentType,
    ContextType,
    RequireFields<QueryGetChapterArgs, 'chapterId'>
  >;
};

export type UpdateUserResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['UpdateUserResult'] = ResolversParentTypes['UpdateUserResult']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UploadScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = {
  user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user_nme?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email_address?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  phone_nbr?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  icon_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  verify_code?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  verify_code_created_tms?: Resolver<
    Maybe<ResolversTypes['Date']>,
    ParentType,
    ContextType
  >;
  created_tms?: Resolver<
    Maybe<ResolversTypes['Date']>,
    ParentType,
    ContextType
  >;
  updated_tms?: Resolver<
    Maybe<ResolversTypes['Date']>,
    ParentType,
    ContextType
  >;
  last_login_tms?: Resolver<
    Maybe<ResolversTypes['Date']>,
    ParentType,
    ContextType
  >;
  accept_terms?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType
  >;
  deleted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  gender?: Resolver<
    Maybe<ResolversTypes['GENDERENUM']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ApproveUserToGroupResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['approveUserToGroupResult'] = ResolversParentTypes['approveUserToGroupResult']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateArticleResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['createArticleResult'] = ResolversParentTypes['createArticleResult']
> = {
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateChapterResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['createChapterResult'] = ResolversParentTypes['createChapterResult']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Chapter']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateGroupResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['createGroupResult'] = ResolversParentTypes['createGroupResult']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteArticleResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['deleteArticleResult'] = ResolversParentTypes['deleteArticleResult']
> = {
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteChapterResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['deleteChapterResult'] = ResolversParentTypes['deleteChapterResult']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Chapter']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteGroupResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['deleteGroupResult'] = ResolversParentTypes['deleteGroupResult']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GetArticleResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['getArticleResult'] = ResolversParentTypes['getArticleResult']
> = {
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GetChapterResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['getChapterResult'] = ResolversParentTypes['getChapterResult']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Chapter']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InviteUserToGroupResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['inviteUserToGroupResult'] = ResolversParentTypes['inviteUserToGroupResult']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type JoinGroupRequestResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['joinGroupRequest'] = ResolversParentTypes['joinGroupRequest']
> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  members?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['User']>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['loginResult'] = ResolversParentTypes['loginResult']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RejectUserToGroupResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['rejectUserToGroupResult'] = ResolversParentTypes['rejectUserToGroupResult']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SearchGroupsByNameResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['searchGroupsByNameResult'] = ResolversParentTypes['searchGroupsByNameResult']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  result?: Resolver<
    Maybe<Array<ResolversTypes['Group']>>,
    ParentType,
    ContextType
  >;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SearchUsersByNameResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['searchUsersByNameResult'] = ResolversParentTypes['searchUsersByNameResult']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  result?: Resolver<
    Maybe<Array<ResolversTypes['User']>>,
    ParentType,
    ContextType
  >;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateArticleResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['updateArticleResult'] = ResolversParentTypes['updateArticleResult']
> = {
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateChapterResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['updateChapterResult'] = ResolversParentTypes['updateChapterResult']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Chapter']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateGroupResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['updateGroupResult'] = ResolversParentTypes['updateGroupResult']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VerifyCodeResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['verifyCodeResult'] = ResolversParentTypes['verifyCodeResult']
> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Article?: ArticleResolvers<ContextType>;
  Chapter?: ChapterResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Group?: GroupResolvers<ContextType>;
  GroupMembers?: GroupMembersResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  UpdateUserResult?: UpdateUserResultResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  approveUserToGroupResult?: ApproveUserToGroupResultResolvers<ContextType>;
  createArticleResult?: CreateArticleResultResolvers<ContextType>;
  createChapterResult?: CreateChapterResultResolvers<ContextType>;
  createGroupResult?: CreateGroupResultResolvers<ContextType>;
  deleteArticleResult?: DeleteArticleResultResolvers<ContextType>;
  deleteChapterResult?: DeleteChapterResultResolvers<ContextType>;
  deleteGroupResult?: DeleteGroupResultResolvers<ContextType>;
  getArticleResult?: GetArticleResultResolvers<ContextType>;
  getChapterResult?: GetChapterResultResolvers<ContextType>;
  inviteUserToGroupResult?: InviteUserToGroupResultResolvers<ContextType>;
  joinGroupRequest?: JoinGroupRequestResolvers<ContextType>;
  loginResult?: LoginResultResolvers<ContextType>;
  rejectUserToGroupResult?: RejectUserToGroupResultResolvers<ContextType>;
  searchGroupsByNameResult?: SearchGroupsByNameResultResolvers<ContextType>;
  searchUsersByNameResult?: SearchUsersByNameResultResolvers<ContextType>;
  updateArticleResult?: UpdateArticleResultResolvers<ContextType>;
  updateChapterResult?: UpdateChapterResultResolvers<ContextType>;
  updateGroupResult?: UpdateGroupResultResolvers<ContextType>;
  verifyCodeResult?: VerifyCodeResultResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
