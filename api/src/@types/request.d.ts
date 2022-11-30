declare namespace Express {
  export interface Request {
    user: import('../auth/entities/request-user.entity').RequestUserEntity,
  }
}
