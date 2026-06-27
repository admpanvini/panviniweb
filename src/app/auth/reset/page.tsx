import ResetPasswordForm from "@/components/blocks/sections/Landing/ResetPassword";

export default async function ResetPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams;

  return (
    <ResetPasswordForm token={params?.token || ""} />
  );
}
