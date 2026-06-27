import { sendEmail } from "./sendEmail";
import { buildEmailTemplate } from "./emailTemplate";

type AccountEmailInput = {
  to: string;
  name: string;
  unidad: string;
};

function getLoginUrl() {
  return `${(process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "")}/auth`;
}

export async function sendAccountRequestedEmail({ to, name, unidad }: AccountEmailInput) {
  const email = buildEmailTemplate({
    title: "Solicitud de cuenta recibida",
    preheader: "Tu cuenta queda a revision por administracion.",
    paragraphs: [
      `Hola ${name}.`,
      `Recibimos tu solicitud de cuenta para la unidad ${unidad}.`,
      "La cuenta queda a revision y sera aprobada dentro de las proximas 48 horas habiles."
    ]
  });

  return sendEmail({
    to,
    subject: "Solicitud de cuenta recibida",
    text: email.text,
    html: email.html
  });
}

export async function sendAccountApprovedEmail({ to, name, unidad }: AccountEmailInput) {
  const loginUrl = getLoginUrl();
  const email = buildEmailTemplate({
    title: "Tu cuenta fue aprobada",
    preheader: "Ya podes ingresar a tu cuenta.",
    paragraphs: [
      `Hola ${name}.`,
      `Tu cuenta para la unidad ${unidad} fue aprobada.`,
      "Ya podes ingresar con tu email, unidad y clave."
    ],
    button: {
      text: "Ingresar a mi cuenta",
      url: loginUrl
    }
  });

  return sendEmail({
    to,
    subject: "Tu cuenta fue aprobada",
    text: email.text,
    html: email.html
  });
}
