import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SharingService } from '../services/sharing.service';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = (route, state): Promise<boolean> | boolean => {
	const userService = inject(UserService)
	const router = inject(Router)
	return new Promise((resolve, reject) => {
		userService.getCurrentUser() //kiem tra có user đang đăng nhập hay không nếu có trả về true, ngược lại trả về false
			.then(user => {
				resolve(true)
			},
				err => {
					resolve(false);
					router.navigate(["/login"]);//nếu chưa đăng nhập chuyển sang trang login
				}
			)
	})
};
