type EmailButton = {
  text: string;
  url: string;
};

type EmailTemplateInput = {
  title: string;
  preheader: string;
  paragraphs: string[];
  button?: EmailButton;
  footer?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getBrandName() {
  return process.env.EMAIL_BRAND_NAME || "Administracion Panvini";
}

function getFooterText() {
  return "Este email fue enviado automaticamente. Por favor no respondas a este mensaje.";
}

function renderParagraphs(paragraphs: string[]) {
  return paragraphs
    .map((p) => `
      <p style="margin:0 0 14px; color:#334155; font-size:15px; line-height:1.6;">
        ${escapeHtml(p)}
      </p>
    `)
    .join("");
}

function renderButton(button?: EmailButton) {
  if (!button) return "";

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0 6px;">
      <tr>
        <td style="border-radius:10px; background:#4f63f0;">
          <a
            href="${escapeHtml(button.url)}"
            target="_blank"
            style="display:inline-block; padding:13px 22px; color:#ffffff; font-size:15px; font-weight:700; text-decoration:none; border-radius:10px;"
          >
            ${escapeHtml(button.text)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

export function buildEmailTemplate({
  title,
  preheader,
  paragraphs,
  button,
  footer
}: EmailTemplateInput) {
  const brandName = getBrandName();
  const footerText = footer || getFooterText();

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin:0; padding:0; background:#f4f7fb; font-family:Arial, Helvetica, sans-serif;">
        <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
          ${escapeHtml(preheader)}
        </div>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f7fb; padding:28px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;">
                <tr>
                  <td style="padding:0 0 12px;">
                    <p style="margin:0; color:#64748b; font-size:13px; font-weight:700; letter-spacing:.02em;">
                      ${escapeHtml(brandName)}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden;">
                    <div style="height:6px; background:#4f63f0;"></div>
                    <div style="padding:30px 28px 26px;">
                      <h1 style="margin:0 0 16px; color:#0f172a; font-size:24px; line-height:1.25; font-weight:800;">
                        ${escapeHtml(title)}
                      </h1>

                      ${renderParagraphs(paragraphs)}
                      ${renderButton(button)}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:16px 4px 0;">
                    <p style="margin:0; color:#94a3b8; font-size:12px; line-height:1.5;">
                      ${escapeHtml(footerText)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = [
    title,
    "",
    ...paragraphs,
    button ? `${button.text}: ${button.url}` : "",
    "",
    footerText
  ].filter(Boolean).join("\n");

  return { html, text };
}
