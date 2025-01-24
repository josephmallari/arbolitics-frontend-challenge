"use client";

import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormData, LoginResponse } from "../app/types";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, MutationFunction } from "@tanstack/react-query";

// perform Login and get accessToken
const loginMutationFn: MutationFunction<LoginResponse, FormData> = async (formData) => {
  try {
    const response = await axios.post<LoginResponse>("/api/login", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      throw new Error(`Failed to login: ${response.statusText}`);
    }
  } catch (error) {
    throw new Error("Failed to login");
  }
};

// login form component
const LoginForm: React.FC = () => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: loginMutationFn,
    onSuccess: (data) => {
      const accessToken = data.data.accessToken;
      // redirect to dashboard with accessToken after successful login
      router.push(`/dashboard?userData=${encodeURIComponent(JSON.stringify(accessToken))}`);
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

  // stored correct values for login for easier testing
  return (
    <div className="flex w-80 min-h-full flex-col justify-center px-6 lg:px-8">
      <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900 py-3">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-base font-medium text-gray-900">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            defaultValue="challenge2025@arbolitics.com"
          />

          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        <div>
          <label className="block text-base font-medium text-gray-900">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6l"
            defaultValue="challenge2025"
          />

          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-6000"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : "Login"}
        </button>
      </form>

      {mutation.isSuccess && <div className="mt-4 text-green-500">Login successful! Loading Dashboard....</div>}
      {mutation.isError && <div className="mt-4 text-red-500">{mutation.error.message || "Login failed!"}</div>}
    </div>
  );
};

export default LoginForm;
