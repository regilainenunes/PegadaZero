from typing import Optional

try:
    from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
except Exception:
    FastMail = None
    MessageSchema = None
    ConnectionConfig = None


def get_mail_client() -> Optional[FastMail]:
    if FastMail is None:
        return None
    # Configuração placeholder; ajuste via variáveis de ambiente se necessário
    conf = ConnectionConfig(
        MAIL_USERNAME="",
        MAIL_PASSWORD="",
        MAIL_FROM="noreply@pegadazero.org",
        MAIL_PORT=587,
        MAIL_SERVER="smtp.mailtrap.io",
        MAIL_TLS=True,
        MAIL_SSL=False,
        USE_CREDENTIALS=False,
    )
    return FastMail(conf)