export const useSignup = () => {
  const mutate = async (data: { email: string; password: string }) => {
    console.log("Signup request (not connected yet):", data);

    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return {
    mutate,
    isPending: false,
  };
};
