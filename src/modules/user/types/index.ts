export interface User {
  id: number
  userName: string
  // password: string
  roleId: number
  email: string | null
  nickName: string | null
  userEnabled: number
  userAvatar: string | null
  createTime: string | Date
  updateTime: string | Date
}

