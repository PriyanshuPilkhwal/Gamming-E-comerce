export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-6 text-text-muted">
        <p>&copy; {new Date().getFullYear()} GameStore. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-primary">Privacy Policy</a>
          <a href="#" className="hover:text-primary">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}