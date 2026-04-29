import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Form from '../models/Form';
import ResponseModel from '../models/Response';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/formbuilder';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    
    await Form.deleteMany({});
    await ResponseModel.deleteMany({});

    const form1 = await Form.create({
      title: 'Job Application Form',
      description: 'Engineering recruitment for Pune & Mumbai branches.',
      shareableId: uuidv4(),
      fields: [
        { id: 'f1_name', label: 'Full Name', type: 'text', required: true },
        { id: 'f1_email', label: 'Email Address', type: 'text', required: true },
        { id: 'f1_experience', label: 'Years of Experience', type: 'number', required: true },
        { id: 'f1_skills', label: 'Primary Skill', type: 'select', required: true, options: ['React', 'Node.js', 'MongoDB', 'Python', 'Java'] },
        { id: 'f1_role', label: 'Preferred Role', type: 'select', required: true, options: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer'] }
      ]
    });

    const form2 = await Form.create({
      title: 'Event Registration Form',
      description: 'Registration for the Maha-Tech Conference 2026.',
      shareableId: uuidv4(),
      fields: [
        { id: 'f2_name', label: 'Full Name', type: 'text', required: true },
        { id: 'f2_contact', label: 'Contact Number', type: 'text', required: true },
        { id: 'f2_ticket', label: 'Ticket Type', type: 'select', required: true, options: ['Standard', 'VIP', 'Student'] },
        { id: 'f2_count', label: 'Number of Tickets', type: 'number', required: true },
        { id: 'f2_days', label: 'Attending Day', type: 'select', required: true, options: ['Day 1', 'Day 2', 'Day 3', 'All Days'] }
      ]
    });

    const form3 = await Form.create({
      title: 'Customer Feedback Form',
      description: 'Your feedback helps us serve Maharashtra better.',
      shareableId: uuidv4(),
      fields: [
        { id: 'f3_name', label: 'Customer Name', type: 'text', required: true },
        { id: 'f3_rating', label: 'Rating (1-5)', type: 'number', required: true },
        { id: 'f3_service', label: 'Service Used', type: 'select', required: true, options: ['Technical Support', 'Billing', 'Sales', 'Onboarding'] },
        { id: 'f3_feedback', label: 'Your Feedback', type: 'text', required: false },
        { id: 'f3_recommend', label: 'Would You Recommend Us?', type: 'select', required: true, options: ['Yes', 'No', 'Maybe'] }
      ]
    });

    const responses = [
      // Form 1 - Job Application (6 Records)
      {
        formId: form1._id,
        answers: { 'f1_name': 'Onkar Doke', 'f1_email': 'onkar.doke@example.in', 'f1_experience': 3, 'f1_skills': 'React', 'f1_role': 'Frontend Developer' }
      },
      {
        formId: form1._id,
        answers: { 'f1_name': 'Aditya Kulkarni', 'f1_email': 'aditya.k@pune-dev.com', 'f1_experience': 5, 'f1_skills': 'Node.js', 'f1_role': 'Backend Developer' }
      },
      {
        formId: form1._id,
        answers: { 'f1_name': 'Snehal Patil', 'f1_email': 'snehal.p@mumbai.tech', 'f1_experience': 2, 'f1_skills': 'MongoDB', 'f1_role': 'Full Stack Developer' }
      },
      {
        formId: form1._id,
        answers: { 'f1_name': 'Rahul Deshmukh', 'f1_email': 'rahul.d@nashik.com', 'f1_experience': 4, 'f1_skills': 'Python', 'f1_role': 'Backend Developer' }
      },
      {
        formId: form1._id,
        answers: { 'f1_name': 'Priyanka Shinde', 'f1_email': 'priya.s@tech.in', 'f1_experience': 6, 'f1_skills': 'Java', 'f1_role': 'DevOps Engineer' }
      },
      {
        formId: form1._id,
        answers: { 'f1_name': 'Amit More', 'f1_email': 'amit.more@vashi.com', 'f1_experience': 1, 'f1_skills': 'React', 'f1_role': 'Frontend Developer' }
      },

      // Form 2 - Event Registration (6 Records)
      {
        formId: form2._id,
        answers: { 'f2_name': 'Sagar Gaikwad', 'f2_contact': '9822011223', 'f2_ticket': 'VIP', 'f2_count': 2, 'f2_days': 'All Days' }
      },
      {
        formId: form2._id,
        answers: { 'f2_name': 'Tushar Joshi', 'f2_contact': '8888001122', 'f2_ticket': 'Standard', 'f2_count': 1, 'f2_days': 'Day 1' }
      },
      {
        formId: form2._id,
        answers: { 'f2_name': 'Deepali Mane', 'f2_contact': '7711223344', 'f2_ticket': 'Student', 'f2_count': 1, 'f2_days': 'Day 2' }
      },
      {
        formId: form2._id,
        answers: { 'f2_name': 'Vikas Pawar', 'f2_contact': '9900112233', 'f2_ticket': 'VIP', 'f2_count': 3, 'f2_days': 'All Days' }
      },
      {
        formId: form2._id,
        answers: { 'f2_name': 'Neha Jadhav', 'f2_contact': '8822334455', 'f2_ticket': 'Standard', 'f2_count': 2, 'f2_days': 'Day 3' }
      },
      {
        formId: form2._id,
        answers: { 'f2_name': 'Rohan Sawant', 'f2_contact': '9090123456', 'f2_ticket': 'Student', 'f2_count': 1, 'f2_days': 'Day 1' }
      },

      // Form 3 - Feedback (6 Records)
      {
        formId: form3._id,
        answers: { 'f3_name': 'Mahesh Kale', 'f3_rating': 5, 'f3_service': 'Technical Support', 'f3_feedback': 'Lajawab service!', 'f3_recommend': 'Yes' }
      },
      {
        formId: form3._id,
        answers: { 'f3_name': 'Anjali Gokhale', 'f3_rating': 4, 'f3_service': 'Billing', 'f3_feedback': 'Very helpful staff.', 'f3_recommend': 'Yes' }
      },
      {
        formId: form3._id,
        answers: { 'f3_name': 'Siddharth Bhosale', 'f3_rating': 2, 'f3_service': 'Sales', 'f3_feedback': 'Slow response time.', 'f3_recommend': 'No' }
      },
      {
        formId: form3._id,
        answers: { 'f3_name': 'Kavita Thorat', 'f3_rating': 5, 'f3_service': 'Onboarding', 'f3_feedback': 'Smooth experience.', 'f3_recommend': 'Yes' }
      },
      {
        formId: form3._id,
        answers: { 'f3_name': 'Prashant Khairnar', 'f3_rating': 3, 'f3_service': 'Technical Support', 'f3_feedback': 'Good but can be faster.', 'f3_recommend': 'Maybe' }
      },
      {
        formId: form3._id,
        answers: { 'f3_name': 'Swati Chavan', 'f3_rating': 4, 'f3_service': 'Billing', 'f3_feedback': 'Easy to understand.', 'f3_recommend': 'Yes' }
      }
    ];

    await ResponseModel.insertMany(responses);
    
    console.log('Database seeded with Maharashtra context data (18 total responses).');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
