/**
 * 文章类型枚举
 */
export enum ArticleTypeEnum {
  /** 原创 */
  ORIGINAL = 1,
  /** 转载 */
  REPRINT = 2,
  /** 翻译 */
  TRANSLATE = 3,
}

/**
 * 文章状态枚举
 */
export enum ArticleStatusEnum {
  /** 已发布 */
  PUBLISHED = 1,
  /** 私密 */
  PRIVATE = 2,
  /** 草稿箱 */
  DRAFT = 3,
  /** 已删除 */
  DELETED = 4,
  /** 待审核 */
  PENDING_REVIEW = 5,
  /** 已拒绝 */
  REJECTED = 6,
}