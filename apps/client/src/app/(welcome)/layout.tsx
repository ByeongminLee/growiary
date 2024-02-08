export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{'body { background-color: #F8F6F0; }'}</style>
      {children}
    </>
  );
}
