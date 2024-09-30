import * as yup from 'yup';

export class ValidationService {
  constructor(public body: unknown) {
    this.body = body;
  }

  /**
   * @description Validate incoming request if no request body passed
   * @param schema yup schema validator
   * @returns A promise that resolves if validation passes
   */
  public async validateBodyRequest<T = unknown>(
    schema: yup.Schema<T>
  ): Promise<T> {
    if (!this?.body)
      throw new Error('Payload is required', {
        cause: {
          statusCode: 400,
        },
      });

    await schema.validate(this.body, { abortEarly: false });

    return this.body as T;
  }
}
