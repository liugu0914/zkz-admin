/**
 * @description: request method
 */
export enum Request {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  get = 'get',
  post = 'post',
  put = 'put',
  delete = 'delete'
}

/**
 * @description:  contentType
 */
export enum ContentType {
  // json
  JSON = 'application/json;charset=UTF-8',
  // form-data qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  upload
  FORM_DATA = 'multipart/form-data;charset=UTF-8'
}

/**
 * http状态码
 */
export enum HttpStatus {
  // 成功
  SUCCESS = 200,
  // 未登录
  UNAUTHORIZATION = 401,
  // 找不到资源
  NOTFOUND = 404,
  // 服务器错误
  ERROR = 500,
  // 操作失败
  FAIL = -1
}
