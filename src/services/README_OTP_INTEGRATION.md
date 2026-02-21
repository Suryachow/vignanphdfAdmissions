# OTP – Current Backend Only (No Django)

**OTP is handled entirely by the FastAPI backend (this CRM app).** The Django OTP_Module_Project is not used. Student app and landing page call only this backend’s APIs.

## Flow

- **Student app** → `VITE_API_URL` (default `http://localhost:8000`) → **FastAPI backend**
- **Endpoints**: `POST /api/otp/send`, `POST /api/otp/verify`
- **Storage**: PostgreSQL `otp_store` (in this backend’s DB)
- **SMS**: Jio Jiocx API called from this backend (`app/sms_otp.py`), not from Django

## Live OTP (Jio SMS + SMTP)

- **Phone OTP**: Backend sends SMS via **Jio Jiocx API** from `app/sms_otp.py`. Configure `JIO_SMS_USERNAME`, `JIO_SMS_PASSWORD` (and optionally other `JIO_*` vars) in the **backend** `.env`.
- **Email OTP**: Backend sends email via SMTP when `SMTP_*` env vars are set in the **backend** `.env`.
- **Frontend**: Student app always calls `POST /api/otp/send` and `POST /api/otp/verify` on the current backend; no Django or external OTP service.

## Testing (when Jio/SMTP not configured)

1. **Backend** (`app/main.py`): Uncomment the blocks marked `TESTING:` in `api_otp_verify` and `api_forgot_password_reset` to accept demo OTP `123456`.
2. **Frontend**: Uncomment the demo hint lines in `StudentLogin.tsx` and `Registration.tsx` if you want to show “Demo: use 123456”.

## Phase recording

- `recordPhase(...)` in `phase.ts` sends `POST /api/student/phase` to this backend. Independent of OTP.
