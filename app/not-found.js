import ErrorState from './(site)/_components/error-state';

export default function NotFound() {
  return (
    <ErrorState
      title="ERROR 404"
      description="Page Not Found"
      imageAlt="404 page not found illustration"
    />
  );
}
