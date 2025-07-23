import { Request, Response, NextFunction } from 'express';

//에러 처리 미들웨어
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  //커스텀 에러 처리
  if (err instanceof BasicError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      code: err.code,
      message: err.message,
      description: err.description
    });

    return;
  }

  //기본 에러 처리 (500)
  res.status(500).json({
    success: false,
    statusCode: 500,
    code: 'ERR-0',
    message: err.message || 'Unknown server error.',
    description: '알 수 없는 서버 에러가 발생했습니다.'
  });
};

//에러 클래스
export class BasicError extends Error {
  public statusCode: number;
  public code: string;
  public description: string;
  public success?: boolean = false;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    description: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.description = description || 'No description: 에러 설명이 없습니다.';
  }
}

export class MailSendFail extends BasicError {
  constructor(description: any) {
    super(500, 'EC500', '메일전송에 실패했습니다.', description);
  }
}
export class MailNotUniv extends BasicError {
  constructor(description: any) {
    super(401, 'EC401', '학교 도메인이 아닙니다.', description);
  }
}
export class CertCodeNotMatch extends BasicError {
  constructor(description: any) {
    super(400, 'EC1', '인증코드가 일치하지 않습니다.', description);
  }
}
export class CertCodeInvaild extends BasicError {
  constructor(description: any) {
    super(400, 'EC2', '인증코드가 유효하지 않습니다.', description);
  }
}
export class CertCodeExpired extends BasicError {
  constructor(description: any) {
    super(400, 'EC3', '인증코드가 만료되었습니다,', description);
  }
}
