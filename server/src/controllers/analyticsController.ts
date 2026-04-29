/**
 * README: Analytics Controller
 * This controller aggregates form data to provide insights.
 * It combines form template data with submitted responses to compute statistics.
 */

import { Request, Response, NextFunction } from 'express';
import Form from '../models/Form';
import ResponseModel from '../models/Response';
import { computeAnalytics } from '../utils/analyticsHelper';

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { formId } = req.params;

    // Find form
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found' });
    }

    // Find all responses for this form
    const responses = await ResponseModel.find({ formId });

    // Compute analytics
    const analytics = computeAnalytics(form, responses);

    res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
};
