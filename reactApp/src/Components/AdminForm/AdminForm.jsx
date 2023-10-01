import React from 'react';

export const AdminForm = ({ Controller, control, errors, trigger }) => {
  return (
    <div className="form-group">
      <div className="form-outline mb-4">
        <label htmlFor="Name">Email address</label>
        <Controller
          name="Name"
          control={control}
          rules={{ required: 'Name is required' }}
          defaultValue=""
          render={({ field }) => (
            <>
              <input {...field} type="text" className={`form-control ${errors.Name ? 'is-invalid' : ''}`} onBlur={() => trigger('Name')} />
              {errors.Name && <p className="invalid-feedback">{errors.Name.message}</p>}
            </>
          )}
        />
      </div>

      <div className="form-outline mb-4">
        <label htmlFor="Password">Password</label>
        <Controller
          name="Password"
          control={control}
          defaultValue=""
          rules={{ required: 'Password is required' }}
          render={({ field }) => (
            <>
              <input {...field} type="password" className={`form-control ${errors.Password ? 'is-invalid' : ''}`} onBlur={() => trigger('Password')} autoComplete="Password" />
              {errors.Password && <p className="invalid-feedback">{errors.Password.message}</p>}
            </>
          )}
        />
      </div>
    </div>
  );
};
