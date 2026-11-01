import { Controller, useForm } from 'react-hook-form';
import { Button } from '../../components/Button/Button';
import { EMAIL_RULES } from './validation';
import { useLogin, useResendVerification } from './useLogin';

export const AdminLoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    setError,
    clearErrors,
    getValues,
  } = useForm({ mode: 'onChange' });

  const { login, isLoading, error: requestError } = useLogin(setError);
  const { resend, isLoading: isResending, isSuccess: isResent } = useResendVerification();

  const onSubmit = (data) => {
    clearErrors('loginError');
    login(data);
  };

  const error = errors.loginError || requestError;
  const isNotVerified = errors.loginError?.type === 'notVerified';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && <div className="error-message" role="alert">{error.message}</div>}
      {isNotVerified && (
        <div className="info-message">
          {isResent ? (
            'A new verification link was sent to your email.'
          ) : (
            <button
              type="button"
              className="link-button"
              disabled={isResending}
              onClick={() => resend(getValues('email'))}
              data-test-specifier="resendVerificationButton"
            >
              {isResending ? 'Sending...' : 'Resend verification email'}
            </button>
          )}
        </div>
      )}

      <div className="form-content">
        <div className="form-group">
          <div className="form-outline mb-4">
            <label htmlFor="loginEmail">Email address</label>
            <Controller
              name="email"
              control={control}
              rules={EMAIL_RULES}
              defaultValue=""
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    id="loginEmail"
                    type="email"
                    autoComplete="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    onBlur={() => trigger('email')}
                    data-test-specifier="usernameInput"
                  />
                  {errors.email && <p className="invalid-feedback">{errors.email.message}</p>}
                </>
              )}
            />
          </div>

          <div className="form-outline mb-4">
            <label htmlFor="loginPassword">Password</label>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{ required: 'Password is required' }}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    id="loginPassword"
                    type="password"
                    autoComplete="current-password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    onBlur={() => trigger('password')}
                    data-test-specifier="passwordInput"
                  />
                  {errors.password && <p className="invalid-feedback">{errors.password.message}</p>}
                </>
              )}
            />
          </div>
        </div>

        {/* setError('loginError') forces isValid to false; allow a retry (e.g. after verifying the email) */}
        <Button
          disabled={!isValid && !errors.loginError}
          type="submit"
          dataTestSpecifier="submitButton"
          className="btn-block mb-4 login-submit-btn"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </div>
    </form>
  );
};
