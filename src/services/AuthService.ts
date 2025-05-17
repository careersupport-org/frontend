interface User {
    id: string;
    nickname: string;
    profileImage: string;
    token: string;
}

export class AuthService {

    static setUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    static getUser(): User | null {
        return JSON.parse(localStorage.getItem('user') || 'null');
    }

    static isAuthenticated(): boolean {
        return !!this.getUser();
    }

    static logout() {
        localStorage.removeItem('user');
    }
} 