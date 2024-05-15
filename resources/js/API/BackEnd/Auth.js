import { AbstractAPI } from '@/API/AbstractAPI.js';

export class Auth extends AbstractAPI {
    async check() {
        return this.get(route('Auth.Check')).then((res) => res);
    }

    async logout() {
        this.post(route('Auth.Logout'));
    }

    goHome() {
        window.location.href = route('Home.Page');
    }

    async claimAuthor(id) {
        if (!id) {
            throw new Error('id parameter is marked as required for claimAuthor()');
        }
        return this.post(route('Auth.Claim'), { id });
    }
}
