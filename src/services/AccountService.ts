import { AuthService } from "./AuthService";
import { UnauthorizedException } from "../common/exceptions";
interface MyProfile {
  bio: string;
}


const BACKEND_API = process.env.REACT_APP_BACKEND_API;
const AccountService = {
  saveMyProfile: async ({ bio }: MyProfile): Promise<void> => {
    const user = AuthService.getUser();

    const response = await fetch(`${BACKEND_API}/oauth/me/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${user?.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ profile: bio })
    });

    if (response.status === 401) {
      return Promise.reject(new UnauthorizedException());
    }

    if (!response.ok) {
      return Promise.reject(new Error('Failed to update profile'));
    }

    if (response.status === 200) {
      return Promise.resolve()
    }

    return Promise.reject(new Error('Failed to update profile'));
  },

  getMyProfile: async (): Promise<MyProfile> => {
    const user = AuthService.getUser();

    const response = await fetch(`${BACKEND_API}/oauth/me/profile`, {
      headers: {
        'Authorization': `Bearer ${user?.token}`
      }
    });

    if (!response.ok) {
      return Promise.reject(new Error('Failed to fetch profile'));
    }

    const data = await response.json()
    const myProfile = {
      bio: data["bio"],
    }
    return Promise.resolve(myProfile);
  },
};

export default AccountService