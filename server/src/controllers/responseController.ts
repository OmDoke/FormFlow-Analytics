/**
 * README: Response Controller
 * This controller handles form submissions and response retrieval.
 * It uses the validator utility to ensure data integrity before saving.
 */

import { Request, Response, NextFunction } from 'express';
import Form from '../models/Form';
import ResponseModel from '../models/Response';
import { validateResponse } from '../utils/validator';

export const submitResponse = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { formId, answers } = req.body;

    // Find the form
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found' });
    }

    // Validate answers
    const validation = validateResponse(form, answers);
    if (!validation.valid) {
      return res.status(400).json({ success: false, errors: validation.errors });
    }

    // Save response
    const newResponse = new ResponseModel({
      formId,
      answers,
      submittedAt: new Date()
    });

    const savedResponse = await newResponse.save();
    res.status(201).json(savedResponse);
  } catch (error) {
    next(error);
  }
};

export const getResponsesByForm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { formId } = req.params;
    const responses = await ResponseModel.find({ formId }).sort({ submittedAt: -1 });
    res.status(200).json(responses);
  } catch (error) {
    next(error);
  }
};
