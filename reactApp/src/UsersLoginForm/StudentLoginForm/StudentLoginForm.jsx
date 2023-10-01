import React from 'react';

export const StudentLoginForm = ({ Controller, control, errors, trigger }) => {
  return (
    <div className="form-group">
      <div className="form-outline mb-4">
        <label htmlFor="studentNumber">Student Number</label>
        <Controller
          name="studentNumber"
          control={control}
          rules={{ required: 'Student number is required' }}
          defaultValue=""
          render={({ field }) => (
            <>
              <input {...field} type="number" className={`form-control ${errors.studentNumber ? 'is-invalid' : ''}`} onBlur={() => trigger('studentNumber')} />
              {errors.studentNumber && <p className="invalid-feedback">{errors.studentNumber.message}</p>}
            </>
          )}
        />
      </div>
    </div>
  );
};
