import { Request, Response, NextFunction } from 'express';
import Form from '../models/Form';
import ResponseModel from '../models/Response';
import { computeAnalytics } from '../utils/analyticsHelper';

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { formId } = req.params;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found' });
    }

    const responses = await ResponseModel.find({ formId });

    const analytics = computeAnalytics(form, responses);

    res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
};
