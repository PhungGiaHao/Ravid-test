import * as yup from 'yup';

export const profileSchema = yup.object().shape({
    fullName: yup.string().required('Full Name is required'),
    middleName: yup.string(),
    lastName: yup.string().required('Last Name is required'),
    username: yup
      .string()
      .required('Email is required')
      .email('Invalid email format'),
    professionalTitle: yup.string(),
    location: yup.string(),
    description: yup.string(),
});

export const categoryFormSchema = yup.object().shape({
  type: yup.string().oneOf(['positions', 'Custom']).required(),
  positionTitle: yup.string().when('type', {
    is: 'positions',
    then: s => s.required('Position Title is required'),
    otherwise: s => s.notRequired(),
  }),
  companyName: yup.string().when('type', {
    is: 'positions',
    then: s => s.required('Company Name is required'),
    otherwise: s => s.notRequired(),
  }),
  startDate: yup.date().when('type', {
    is: 'positions',
    then: s => s.required('Start Date is required'),
    otherwise: s => s.notRequired(),
  }),
  label: yup.string().when('type', {
    is: 'Custom',
    then: s => s.required('Tab Name is required'),
    otherwise: s => s.notRequired(),
  }),
});
