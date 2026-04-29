import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Form from '../models/Form';

export const createForm = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, fields } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one field is required' });
    }

    for (const field of fields) {
      if (!field.label || !field.type) {
        return res.status(400).json({ success: false, message: 'Field label and type are required' });
      }
      if (!['text', 'number', 'select'].includes(field.type)) {
        return res.status(400).json({ success: false, message: 'Invalid field type' });
      }
      if (field.type === 'select' && (!Array.isArray(field.options) || field.options.length === 0)) {
        return res.status(400).json({ success: false, message: 'Select fields must have at least one option' });
      }
      if (!field.id) {
        field.id = `f_${uuidv4().substring(0, 8)}`;
      }
    }

    const shareableId = uuidv4();
    const newForm = new Form({
      title,
      description,
      fields,
      shareableId
    });

    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    next(error);
  }
};

export const getAllForms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    next(error);
  }
};

export const getFormById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found' });
    }
    res.status(200).json(form);
  } catch (error) {
    next(error);
  }
};

export const getFormByShareableId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const form = await Form.findOne({ shareableId: req.params.shareableId }).select('-__v');
    if (!form) {
      return res.status(404).json({ success: false, message: 'Public form not found' });
    }
    res.status(200).json(form);
  } catch (error) {
    next(error);
  }
};
