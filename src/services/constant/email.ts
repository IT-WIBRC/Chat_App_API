export const EMAIL_ACCOUNT_CREATION_SUBJECT = "Welcome on the Chat application";

export const setHTMLContentCreation = (username: string): string => {
  return `
    <div style="text-align: center; padding: 4px 4px;">
      <h1 style="padding: 3px 2px;font-size: 2rem;">Chat Application</h1>
      <p style="padding: 2px 0;">Welcome to the chat app ${username}. Your account has been created successfully.</p>
      <p>We wish this will be great usable for you. If not please share what is not good and we will try to fix it if possible.</p>

      <span style="font-weight: bold; font-size: 1em; marging: 3px;">Thanks for the comprehension and account.</span>
    <div>`;
};
