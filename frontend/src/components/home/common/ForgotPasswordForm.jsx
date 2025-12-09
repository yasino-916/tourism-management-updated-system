import React, { useState } from "react";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Reset link sent to: " + email);
  };

  return (
    <div className="forgot-container">
      <form onSubmit={handleSubmit} className="forgot-form">
        <h2>Forgot Password</h2>

        <label>Email Address</label>
        <input
          type="email"
          className="input-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        <button type="submit" className="btnn">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
