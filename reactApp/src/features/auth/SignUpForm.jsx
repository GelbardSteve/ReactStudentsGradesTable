import { Controller, useForm } from 'react-hook-form';
import { getErrorMessage } from '../../api/client';
import { Button } from '../../components/Button/Button';
import { EMAIL_RULES, PASSWORD_MIN_LENGTH } from './validation';
import { useSignUp } from './useLogin';

export const SignUpForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    getValues,
  } = useForm({ mode: 'onChange' });

  const { signUp, isLoading, isSuccess, error } = useSignUp();

  const onSubmit = ({ email, password }) => signUp({ email, password });

  if (isSuccess) {
    return (
      <div className="form-content" data-test-specifier="signupSuccess">
        <div className="success-message" role="status">
          Check your inbox at <strong>{getValues('email')}</strong> and click the link to activate your account.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <div className="error-message" role="alert">
          {getErrorMessage(error, 'Could not sign up. Please try again.')}
        </div>
      )}

      <div className="form-content">
        <div className="form-group">
          <div className="form-outline mb-4">
            <label htmlFor="signupEmail">Email address</label>
            <Controller
              name="email"
              control={control}
              rules={EMAIL_RULES}
              defaultValue=""
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    id="signupEmail"
                    type="email"
                    autoComplete="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    onBlur={() => trigger('email')}
                    data-test-specifier="signupEmailInput"
                  />
                  {errors.email && <p className="invalid-feedback">{errors.email.message}</p>}
                </>
              )}
            />
          </div>

          <div className="form-outline mb-4">
            <label htmlFor="signupPassword">Password</label>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: 'Password is required',
                minLength: { value: PASSWORD_MIN_LENGTH, message: `At least ${PASSWORD_MIN_LENGTH} characters` },
              }}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    id="signupPassword"
                    type="password"
                    autoComplete="new-password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    onBlur={() => trigger('password')}
                    data-test-specifier="signupPasswordInput"
                  />
                  {errors.password && <p className="invalid-feedback">{errors.password.message}</p>}
                </>
              )}
            />
          </div>

          <div className="form-outline mb-4">
            <label htmlFor="signupConfirmPassword">Confirm password</label>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              rules={{
                required: 'Please confirm your password',
                validate: (value) => value === getValues('password') || 'Passwords do not match',
              }}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    id="signupConfirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    onBlur={() => trigger('confirmPassword')}
                    data-test-specifier="signupConfirmPasswordInput"
                  />
                  {errors.confirmPassword && <p className="invalid-feedback">{errors.confirmPassword.message}</p>}
                </>
              )}
            />
          </div>
        </div>

        <Button
          disabled={!isValid}
          type="submit"
          dataTestSpecifier="signupSubmitButton"
          className="btn-block mb-4 login-submit-btn"
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </div>
    </form>
  );
};
