// Fake "database" of users
export const registeredUsers: User[] = [
  { userName: 'admin', password: 'admin', isModerator: true },
  { userName: 'alice', password: 'password123', isModerator: false },
  { userName: 'bob', password: 'secret', isModerator: false },
  { userName: 'charlie', password: 'charliepass', isModerator: false },
];

export const login = (userName: string, password: string): string | null => {
  const foundUser = registeredUsers.find(
    (user) => user.userName === userName && user.password === password
  );

  if (foundUser) {
    localStorage.setItem('user', JSON.stringify(foundUser));
    return null;
  } else {
    return 'Invalid username or password';
  }
};

export const logout = () => {
  localStorage.removeItem('user'); 
};

export const getLoggedInUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};