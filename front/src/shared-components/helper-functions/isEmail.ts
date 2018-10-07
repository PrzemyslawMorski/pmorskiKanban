export const isEmail = (email: string) => {
  const w3cEmailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return w3cEmailRegex.test(email);
};
