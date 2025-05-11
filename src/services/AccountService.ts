interface MyProfile {
  bio: string;
}


const BACKEND_API = process.env.REACT_APP_BACKEND_API;
const AccountService = {
  saveMyProfile: async ({ bio }: MyProfile): Promise<void> => {
    const response = await fetch(`${BACKEND_API}/oauth/me/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ profile: bio })
    });

    const data = await response.json();
    return Promise.resolve(); // 임시 성공 처리
  },

  getMyProfile: async (): Promise<MyProfile> => {
    const response = await fetch(`${BACKEND_API}/oauth/me/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json()
    const myProfile = {
      bio: data["bio"],
    }
    return Promise.resolve(myProfile);
  },
};

export default AccountService