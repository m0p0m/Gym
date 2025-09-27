import { Request, Response, NextFunction } from 'express';

const clean = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => clean(v));
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc: { [key: string]: any }, key: string) => {
      const newKey = key.replace(/\$/g, '').replace(/\./g, '');
      acc[newKey] = clean(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

const customMongoSanitize = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = clean(req.body);
  }
  if (req.query) {
    req.query = clean(req.query);
  }
  if (req.params) {
    req.params = clean(req.params);
  }
  next();
};

export default customMongoSanitize;