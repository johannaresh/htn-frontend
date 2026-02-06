'use client';

import { useState, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SuccessState } from '@/components/ui/SuccessState';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  organization: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  organization?: string;
  message?: string;
}

export const ContactFormModal = ({ isOpen, onClose }: ContactFormModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    organization: '',
    message: '',
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

    if (!data.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!data.organization.trim()) {
      newErrors.organization = 'Organization is required';
    }

    if (!data.message.trim()) {
      newErrors.message = 'Message is required';
    }

    return newErrors;
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
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
    setFormData({ name: '', email: '', organization: '', message: '' });
    setErrors({});
    setTouched(new Set());
    setHasAttemptedSubmit(false);
    setIsSubmitted(false);
    onClose();
  };

  const isFormValid =
    formData.name.trim() &&
    formData.email.trim() &&
    validateEmail(formData.email) &&
    formData.organization.trim() &&
    formData.message.trim();

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
          message="Thank you for wanting to support this event."
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
        form="contact-form"
        variant="primary"
        disabled={!isFormValid}
        className={!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
      >
        Send Message
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Contact Us" footer={footerContent}>
      <form id="contact-form" onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-300 mb-1">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="contact-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName('name')}
            placeholder="Enter your name"
          />
          {shouldShowError('name') && (
            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300 mb-1">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="contact-email"
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

        {/* Organization */}
        <div className="mb-4">
          <label htmlFor="contact-organization" className="block text-sm font-medium text-gray-300 mb-1">
            Organization <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="contact-organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClassName('organization')}
            placeholder="Enter your organization"
          />
          {shouldShowError('organization') && (
            <p className="mt-1 text-sm text-red-400">{errors.organization}</p>
          )}
        </div>

        {/* Message */}
        <div className="mb-4">
          <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300 mb-1">
            Message <span className="text-red-400">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={4}
            className={`${inputClassName('message')} resize-y max-h-[220px]`}
            placeholder="How would you like to support our event?"
          />
          {shouldShowError('message') && (
            <p className="mt-1 text-sm text-red-400">{errors.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
};
