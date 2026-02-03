import { useState, useCallback } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { SuccessState } from '../ui/SuccessState';

interface VolunteerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  roleInterest: string;
  shortNote: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  roleInterest?: string;
  shortNote?: string;
}

const ROLE_OPTIONS = [
  { value: '', label: 'Select a role...' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'sponsorship', label: 'Sponsorship' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'general', label: 'General' },
];

export const VolunteerFormModal = ({ isOpen, onClose }: VolunteerFormModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    roleInterest: '',
    shortNote: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = useCallback((data: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!data.roleInterest) {
      newErrors.roleInterest = 'Please select a role';
    }

    if (!data.shortNote.trim()) {
      newErrors.shortNote = 'Please add a short note';
    }

    return newErrors;
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // Re-validate if we've already attempted submit or field has been touched
    if (hasAttemptedSubmit || touched.has(name)) {
      const newErrors = validateForm(newFormData);
      setErrors(newErrors);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => new Set(prev).add(name));

    // Validate on blur after first touch
    const newErrors = validateForm(formData);
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Simulate successful submission
      setIsSubmitted(true);
    }
  };

  const handleClose = () => {
    // Reset form state when closing
    setFormData({ fullName: '', email: '', roleInterest: '', shortNote: '' });
    setErrors({});
    setTouched(new Set());
    setHasAttemptedSubmit(false);
    setIsSubmitted(false);
    onClose();
  };

  const isFormValid =
    formData.fullName.trim() &&
    formData.email.trim() &&
    validateEmail(formData.email) &&
    formData.roleInterest &&
    formData.shortNote.trim();

  const shouldShowError = (fieldName: keyof FormErrors): boolean => {
    return (hasAttemptedSubmit || touched.has(fieldName)) && !!errors[fieldName];
  };

  const inputClassName = (fieldName: keyof FormErrors): string => {
    const baseClass =
      'w-full px-3 py-2 bg-gray-800 border rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent';
    const errorClass = 'border-red-500';
    const normalClass = 'border-gray-700';
    return `${baseClass} ${shouldShowError(fieldName) ? errorClass : normalClass}`;
  };

  if (isSubmitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <SuccessState
          message="Thank you for submitting your application."
          onClose={handleClose}
        />
      </Modal>
    );
  }

  const footerContent = (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button
        type="submit"
        form="volunteer-form"
        variant="primary"
        disabled={!isFormValid}
        className={!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
      >
        Submit Application
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Apply to Volunteer" footer={footerContent}>
      <form id="volunteer-form" onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName('fullName')}
            placeholder="Enter your full name"
          />
          {shouldShowError('fullName') && (
            <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName('email')}
            placeholder="Enter your email address"
          />
          {shouldShowError('email') && (
            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Role Interest */}
        <div className="mb-4">
          <label htmlFor="roleInterest" className="block text-sm font-medium text-gray-300 mb-1">
            Role Interest <span className="text-red-400">*</span>
          </label>
          <select
            id="roleInterest"
            name="roleInterest"
            value={formData.roleInterest}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName('roleInterest')}
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {shouldShowError('roleInterest') && (
            <p className="mt-1 text-sm text-red-400">{errors.roleInterest}</p>
          )}
        </div>

        {/* Short Note */}
        <div className="mb-4">
          <label htmlFor="shortNote" className="block text-sm font-medium text-gray-300 mb-1">
            Short Note <span className="text-red-400">*</span>
          </label>
          <textarea
            id="shortNote"
            name="shortNote"
            value={formData.shortNote}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={3}
            className={`${inputClassName('shortNote')} resize-y max-h-[180px]`}
            placeholder="Tell us why you'd like to volunteer..."
          />
          {shouldShowError('shortNote') && (
            <p className="mt-1 text-sm text-red-400">{errors.shortNote}</p>
          )}
        </div>
      </form>
    </Modal>
  );
};
