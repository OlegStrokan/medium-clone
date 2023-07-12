import * as yup from 'yup'

export const forgotPasswordSchema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    verificationCode: yup
        .string()
        .test(
            'verification-code',
            'Verification code is required',
            function (value) {
                const { email } = this.parent
                if (!!email) {
                    return !!value
                }
                return true
            }
        ),
    newPassword: yup
        .string()
        .test('new-password', 'New password is required', function (value) {
            const { email, verificationCode } = this.parent
            if (!!email && !!verificationCode) {
                return !!value
            }
            return true
        }),
})
