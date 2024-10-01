import jwt from 'jsonwebtoken'

export enum JwtSignType {
  LOGIN = 'Login'
}

export type JwtPayload = {
  id: string
}

export class JwtService {
  /**
   * @description Generate jwt sign key
   * @param signType typeof signType JwtServiceSignType
   * @returns object of signed jwt config
   */
  static getJwtSignKeyConfig = (signType: JwtSignType = JwtSignType.LOGIN) => {
    switch (signType) {
      case JwtSignType.LOGIN:
        return {
          jwtSignKey: process.env.APP_DATA_SECRET_KEY,
          expiresIn: '5m'
        }
    }
  }

  /**
   * @description Generate JWT token
   * @param payload jwt token payload
   * @param signType typeof signType JwtServiceSignType
   * @param config jwt.SignOptions
   * @return {string} token
   */
  static generateToken = (
    payload: JwtPayload,
    signType?: JwtSignType,
    config?: jwt.SignOptions
  ): string => {
    return jwt.sign(
      payload,
      this.getJwtSignKeyConfig(signType || JwtSignType.LOGIN).jwtSignKey,
      {
        ...config,
        expiresIn:
          config?.expiresIn ||
          this.getJwtSignKeyConfig(signType || JwtSignType.LOGIN).expiresIn
      }
    )
  }

  /**
   * @description Verify jwt token
   * @param token jwt token
   * @param signType typeof signType JwtServiceSignType
   * @returns JwtPayload
   */
  static verify(token: string, signType?: JwtSignType): JwtPayload {
    return jwt.verify(
      token,
      this.getJwtSignKeyConfig(signType || JwtSignType.LOGIN).jwtSignKey
    ) as JwtPayload
  }
}
