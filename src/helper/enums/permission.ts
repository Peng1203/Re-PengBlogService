/**
 * 操作权限标识枚举
 */
export enum PermissionEnum {
  TEST = 'test_1',

  /** 用户 */
  CREATE_USER = 'create_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',

  /** 角色 */
  CREATE_ROLE = 'create_role',
  UPDATE_ROLE = 'update_role',
  DELETE_ROLE = 'delete_role',

  /** 菜单 */
  CREATE_MENU = 'create_menu',
  UPDATE_MENU = 'update_menu',
  DELETE_MENU = 'delete_menu',
  INIT_MENU = 'init_menu',

  /** 权限标识 */
  GET_PERMISSION = 'get_permission',
  CREATE_PERMISSION = 'create_permission',
  UPDATE_PERMISSION = 'update_permission',
  DELETE_PERMISSION = 'delete_permission',

  /** 文章标签 */
  CREATE_TAG = 'create_tag',
  UPDATE_TAG = 'update_tag',
  DELETE_TAG = 'delete_tag',

  /** 文章分类 */
  CREATE_CATEGORY = 'create_category',
  UPDATE_CATEGORY = 'update_category',
  DELETE_CATEGORY = 'delete_category',

  /** 文章 */
  CREATE_ARTICLE = 'create_article',
  UPDATE_ARTICLE = 'update_article',
  DELETE_ARTICLE = 'delete_article',

  /** 日志管理 */
  // 审计日志
  GET_AUDIT_LOG = 'get_audit_log',
  DELETE_AUDIT_LOG = 'delete_audit_log',
  // 登录日志
  GET_LOGIN_LOG = 'get_login_log',
  DELETE_LOGIN_LOG = 'delete_login_log',

  /** 资源管理 */
  UPLOAD_RESOURCE = 'upload_resource',
  DELETE_RESOURCE = 'delete_resource',
}
