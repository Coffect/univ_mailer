export const isUnivDomain = (email: string) => {
  const domain = email.split('@')[1];
  const regex = /(ac\.kr|edu(\.kr)?|\.edu)$/i;
  return regex.test(domain);
};
