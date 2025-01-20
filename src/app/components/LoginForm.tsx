"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

const LoginForm = () => {
  // Define the mutation for the POST request
  // @ts-ignore
  const mutation = useMutation({
    mutationFn: async (formData) => {
      console.log(formData);
      const response = await fetch("https://staging-api.arbolitics.com/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to login");
      }
      return response.json();
    },
  });

  // Setup React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = (data: void) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      {/* @ts-ignore */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="border rounded px-3 py-2 w-full"
            value="challenge2025@arbolitics.com"
          />

          {/* @ts-ignore */}
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        {/* Password Field */}
        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="border rounded px-3 py-2 w-full"
            value="challenge2025"
          />

          {/* @ts-ignore */}
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        {/* Submit Button */}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          // @ts-ignore
          disabled={mutation.isLoading}
        >
          {/* @ts-ignore */}
          {mutation.isLoading ? "Submitting..." : "Login"}
        </button>
      </form>

      {/* Display success or error messages */}
      {mutation.isSuccess && <div className="mt-4 text-green-500">Login successful!</div>}
      {mutation.isError && <div className="mt-4 text-red-500">{mutation.error.message || "Login failed!"}</div>}
    </div>
  );
};

export default LoginForm;
