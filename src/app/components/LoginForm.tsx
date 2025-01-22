"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, MutationFunction } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

interface FormData {
  email: string;
  password: string;
}

const loginMutationFn: MutationFunction<any, FormData> = async (formData) => {
  const response = await axios.post("/api/proxy", formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error("Failed to login");
  }
  return response.data;
};

const LoginForm: React.FC = () => {
  const router = useRouter();
  // Define the mutation for the POST request
  const mutation = useMutation({
    mutationFn: loginMutationFn,
    onSuccess: (data) => {
      const accessToken = data.data.accessToken;
      router.push(`/data?userData=${encodeURIComponent(JSON.stringify(accessToken))}`);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-sm mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="border rounded px-3 py-2 w-full"
            defaultValue="challenge2025@arbolitics.com"
          />

          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        <div>
          <label className="block font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="border rounded px-3 py-2 w-full"
            defaultValue="challenge2025"
          />

          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        {/* Submit Button */}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : "Login"}
        </button>
      </form>

      {/* Display success or error messages */}
      {mutation.isSuccess && <div className="mt-4 text-green-500">Login successful!</div>}
      {mutation.isError && <div className="mt-4 text-red-500">{mutation.error.message || "Login failed!"}</div>}
    </div>
  );
};

export default LoginForm;
