import React, { useState, useRef } from 'react';
import ProfileCard from './ProfileCard';
import './FlippableProfileCard.css';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function FlippableProfileCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [botcheck, setBotcheck] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const lastSubmitTimeRef = useRef<number>(0);

  const handleFlip = () => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);

    if (nextFlipped) {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 700);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Botcheck honeypot verification
    if (botcheck) {
      // Silently discard bot submission
      setFeedback({
        type: 'success',
        message: "Message Sent! Thank you for reaching out. I'll get back to you soon!",
      });
      return;
    }

    // 2. Client-side rate limiting / cooldown (15 seconds)
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < 15000) {
      setFeedback({
        type: 'error',
        message: 'Please wait a few seconds before sending another message.',
      });
      return;
    }

    // 3. Input normalization and validation
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedSubject = formData.subject.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      setFeedback({
        type: 'error',
        message: 'Please fill out all required fields.',
      });
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setFeedback({
        type: 'error',
        message: 'Please provide a valid email address.',
      });
      return;
    }

    // Length limit checks
    if (trimmedName.length > 100 || trimmedEmail.length > 150 || trimmedSubject.length > 200 || trimmedMessage.length > 2000) {
      setFeedback({
        type: 'error',
        message: 'Input exceeds maximum allowed length.',
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const accessKey =
      (import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined) ||
      '4064a6d2-594f-42e2-8ea0-e73f437d2aec';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: trimmedName,
          email: trimmedEmail,
          subject: trimmedSubject,
          message: trimmedMessage,
          to_email: 'Durgeshpadwal729@gmail.com',
          botcheck: false,
        }),
      });

      const result = await response.json();

      if (result.success) {
        lastSubmitTimeRef.current = Date.now();
        setFeedback({
          type: 'success',
          message: "Message Sent! Thank you for reaching out. I'll get back to you soon!",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFeedback({
          type: 'error',
          message: result.message || 'Failed to send message. Please try again.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flip-card-wrapper">
      <div
        className={`profile-flip-card ${isFlipped ? 'flipped' : ''}`}
        onClick={() => {
          if (!isFlipped) handleFlip();
        }}
        role="button"
        tabIndex={0}
        aria-label="Flip to contact form"
        aria-expanded={isFlipped}
        onKeyDown={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON') return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
          }
        }}
      >
        <div className="flip-card-inner">
          {/* Front Side: Profile Card */}
          <div className="flip-card-front" aria-hidden={isFlipped}>
            <ProfileCard
              name="Durgesh H Padwal"
              title="Data Analyst & Machine Learning Student"
              handle="@Durgesh"
              status="Busy"
              contactText="Contact Me"
              avatarUrl="/portfoliocolorphoto.webp"
              enableTilt={!isFlipped}
              onContactClick={() => {
                if (!isFlipped) handleFlip();
              }}
            />
          </div>

          {/* Back Side: Contact Card (Form) */}
          <div className="flip-card-back" aria-hidden={!isFlipped}>
            <form
              onSubmit={(e) => {
                e.stopPropagation();
                handleSubmit(e);
              }}
              className="contact-form"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {feedback && (
                <div className={`form-feedback ${feedback.type}`}>
                  {feedback.message}
                </div>
              )}

              {/* Botcheck anti-spam honeypot (hidden from real users) */}
              <input
                type="checkbox"
                name="botcheck"
                checked={botcheck}
                onChange={(e) => setBotcheck(e.target.checked)}
                tabIndex={-1}
                autoComplete="off"
                style={{ display: 'none' }}
                aria-hidden="true"
              />

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <div className="form-control">
                    <input
                      ref={nameInputRef}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      maxLength={100}
                      className="input input-alt"
                    />
                    <span className="input-border-alt" />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="form-control">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      maxLength={150}
                      className="input input-alt"
                    />
                    <span className="input-border-alt" />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <div className="form-control">
                  <input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    required
                    maxLength={200}
                    className="input input-alt"
                  />
                  <span className="input-border-alt" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <div className="form-control">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    required
                    maxLength={2000}
                    rows={4}
                    className="input input-alt"
                  />
                  <span className="input-border-alt" />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="contact-send-btn"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip();
                  }}
                  className="contact-back-btn"
                  aria-label="Back to profile"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
