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

function getBrandColor() {
  return process.env.EMAIL_BRAND_COLOR || "#39478b";
}

function getFooterText() {
  return "Este email fue enviado automaticamente. Por favor no respondas a este mensaje.";
}

function renderParagraphs(paragraphs: string[]) {
  return paragraphs
    .map((p) => `
      <p style="margin:0 0 14px; color:#334155; font-size:15px; line-height:1.65;">
        ${escapeHtml(p)}
      </p>
    `)
    .join("");
}

function renderButton(button: EmailButton | undefined, brandColor: string) {
  if (!button) return "";

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:26px 0 4px;">
      <tr>
        <td style="border-radius:14px; background:${brandColor}; box-shadow:0 14px 28px rgba(57,71,139,.26);">
          <a
            href="${escapeHtml(button.url)}"
            target="_blank"
            style="display:inline-block; padding:14px 24px; color:#ffffff; font-size:15px; font-weight:700; text-decoration:none; border-radius:14px;"
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
  const brandColor = getBrandColor();
  const footerText = footer || getFooterText();

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin:0; padding:0; background:#eef3fb; font-family:Arial, Helvetica, sans-serif;">
        <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
          ${escapeHtml(preheader)}
        </div>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eef3fb; padding:30px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;">
                <tr>
                  <td style="padding:0 0 14px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td>
                          <p style="margin:0; color:#64748b; font-size:13px; font-weight:700; letter-spacing:.02em;">
                            ${escapeHtml(brandName)}
                          </p>
                        </td>
                        <td align="right">
                          <span style="display:inline-block; width:34px; height:34px; border-radius:12px; background:${brandColor}; box-shadow:0 10px 24px rgba(57,71,139,.22);"></span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="background:#ffffff; border:1px solid #dde6f2; border-radius:24px; overflow:hidden; box-shadow:0 24px 60px rgba(28,39,73,.14);">
                    <div style="height:8px; background:${brandColor};"></div>
                    <div style="padding:32px 28px 28px;">
                      <div style="display:inline-block; padding:8px 12px; border-radius:999px; background:#f1f5fb; color:${brandColor}; font-size:12px; font-weight:700; margin:0 0 16px;">
                        ${escapeHtml(preheader)}
                      </div>
                      <h1 style="margin:0 0 18px; color:#0f172a; font-size:26px; line-height:1.25; font-weight:800;">
                        ${escapeHtml(title)}
                      </h1>

                      <div style="background:#f8fafc; border:1px solid #e5edf7; border-radius:18px; padding:18px 18px 6px;">
                        ${renderParagraphs(paragraphs)}
                      </div>

                      ${renderButton(button, brandColor)}
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
